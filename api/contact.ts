import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/** Field length caps. Enforced here because the browser cannot be trusted. */
const MAX = { name: 100, email: 254, message: 2000 };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const COOLDOWN_MS = 60 * 1000;

/**
 * Best-effort in-memory rate limiter, keyed by client IP.
 *
 * Serverless instances are ephemeral and are not shared, so this bounds bursts
 * against a single warm instance rather than a patient, distributed attacker.
 * The EmailJS account quota remains the hard backstop. Swap in Redis (Upstash)
 * if abuse ever becomes real.
 */
const hits = new Map<string, number[]>();

const prune = (now: number): void => {
  for (const [ip, times] of hits) {
    const kept = times.filter((t) => now - t < WINDOW_MS);
    if (kept.length) hits.set(ip, kept);
    else hits.delete(ip);
  }
};

const clientIp = (req: VercelRequest): string => {
  // Vercel sets x-real-ip to the true edge-observed client IP, which the client
  // cannot forge. x-forwarded-for is "<client-supplied...>, <real edge IP>", so
  // its LEFTMOST entry is attacker-controlled and its rightmost is the trusted
  // one Vercel appended. Keying the rate limiter on the leftmost value let a
  // caller rotate the header and land in a fresh bucket every request, defeating
  // the limit. Prefer x-real-ip; fall back to the rightmost forwarded entry.
  const realIp = req.headers["x-real-ip"];
  const real = Array.isArray(realIp) ? realIp[0] : realIp;
  if (real) return real.trim();

  const xff = req.headers["x-forwarded-for"];
  const raw = Array.isArray(xff) ? xff[0] : xff;
  const parts = (raw ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 1] || "unknown";
};

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const parseBody = (body: unknown): Record<string, unknown> | null => {
  if (typeof body === "string") {
    try {
      const parsed: unknown = JSON.parse(body);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Defence in depth only. A browser cannot forge Origin, but a script can omit
  // or spoof it, so validation and rate limiting below are the real controls.
  const allowed = (process.env.ALLOWED_ORIGIN ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  if (origin && allowed.length > 0 && !allowed.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const body = parseBody(req.body);
  if (!body) return res.status(400).json({ error: "Invalid request body." });

  // Honeypot: a real visitor never fills this. Report success so bots learn nothing.
  if (str(body.website)) return res.status(200).json({ ok: true });

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are all required." });
  }
  if (name.length > MAX.name) {
    return res.status(400).json({ error: `Name must be ${MAX.name} characters or fewer.` });
  }
  if (email.length > MAX.email || !isEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (message.length > MAX.message) {
    return res.status(400).json({ error: `Message must be ${MAX.message} characters or fewer.` });
  }

  const now = Date.now();
  prune(now);
  const ip = clientIp(req);
  const times = hits.get(ip) ?? [];

  if (times.length >= MAX_PER_WINDOW) {
    res.setHeader("Retry-After", String(Math.ceil(WINDOW_MS / 1000)));
    return res.status(429).json({ error: `Too many messages. Limit is ${MAX_PER_WINDOW} per hour.` });
  }

  const last = times[times.length - 1];
  if (last !== undefined && now - last < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
    res.setHeader("Retry-After", String(wait));
    return res.status(429).json({ error: `Please wait ${wait}s before sending another message.` });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error("[contact] missing EmailJS environment variables");
    return res.status(500).json({ error: "Server is not configured to send mail." });
  }

  // Reserve the slot before the outbound call so repeated failures cannot be
  // used to hammer EmailJS. Costs a legitimate sender one slot on a failed send.
  hits.set(ip, [...times, now]);

  try {
    const upstream = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: { user_name: name, user_email: email, message },
      }),
    });

    if (!upstream.ok) {
      // Detail stays in the server log; the client gets nothing actionable.
      console.error("[contact] EmailJS rejected:", upstream.status, await upstream.text());
      return res.status(502).json({ error: "Could not send message. Please try again later." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] upstream request failed:", err);
    return res.status(502).json({ error: "Could not send message. Please try again later." });
  }
}
