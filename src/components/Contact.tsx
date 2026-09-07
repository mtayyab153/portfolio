import { Mail, Linkedin, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Client-side send throttle. This guards against double-submits and repeated
// clicking; it is not a security control, since anything that does not run
// this JavaScript is unaffected by it.
const COOLDOWN_MS = 1 * 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 3;
const WINDOW_MS = 60 * 60 * 1000;
const STORAGE_KEY = "contact:sends";

/** Mirrors the caps enforced in api/contact.ts. */
const LIMITS = { name: 100, email: 254, message: 2000 };

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const validate = (data: Record<FieldName, string>): FieldErrors => {
  const errors: FieldErrors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address, for example name@example.com.";

  if (!message) errors.message = "Please enter a message.";
  else if (message.length > LIMITS.message)
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;

  return errors;
};

/** Renders a remaining-seconds count as "9m 05s", or "45s" under a minute. */
const formatWait = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest.toString().padStart(2, "0")}s`;
};

/** Recent send timestamps, oldest first, with anything outside the window dropped. */
const readSends = (): number[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - WINDOW_MS;
    return parsed.filter((t): t is number => typeof t === "number" && t > cutoff);
  } catch {
    return [];
  }
};

const writeSends = (sends: number[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sends));
  } catch {
    // Storage blocked (private mode). The throttle still works within this
    // page view, it just will not survive a reload.
  }
};



const Contact = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Keep the button countdown current, including after a reload.
  useEffect(() => {
    const tick = () => {
      const sends = readSends();
      const last = sends[sends.length - 1];
      const remaining = last ? COOLDOWN_MS - (Date.now() - last) : 0;
      setCooldownLeft(remaining > 0 ? Math.ceil(remaining / 1000) : 0);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   toast({
  //     title: "Message sent!",
  //     description: "Thank you for reaching out. I'll get back to you soon.",
  //   });
  //   setFormData({ name: "", email: "", message: "" });
  // };

  const updateField =
    (field: FieldName) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
      setFormError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setFormError(null);

    // Validate before the throttle so the visitor is told what to fix first.
    const fieldErrors = validate(formData);
    setErrors(fieldErrors);
    const firstInvalid = (["name", "email", "message"] as FieldName[]).find((k) => fieldErrors[k]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const sends = readSends();

    if (sends.length >= MAX_PER_WINDOW) {
      toast({
        title: "Too many messages",
        description: `This form accepts ${MAX_PER_WINDOW} messages per hour. Please email me directly at mtaeyyab15@gmail.com if it is urgent.`,
        variant: "destructive",
      });
      return;
    }

    const last = sends[sends.length - 1];
    if (last && Date.now() - last < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
      toast({
        title: "Message already sent",
        description: `Thanks - I have your message. You can send another in ${formatWait(wait)}.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data: { error?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        // The endpoint explains 400s and 429s precisely; surfacing its reason
        // tells the visitor what to change instead of just "it failed".
        setFormError(data.error ?? "Something went wrong. Please try again later.");
        toast({
          title: res.status === 429 ? "Please slow down" : "Could not send message",
          description: data.error ?? "Something went wrong. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", message: "" });
      writeSends([...sends, Date.now()]);
      setCooldownLeft(Math.ceil(COOLDOWN_MS / 1000));
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-wider uppercase">Contact</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Let's Work Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a process that needs automating? Let's discuss how RPA can transform your operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-heading font-semibold mb-4">Get in Touch</h3>
              <p className="text-muted-foreground mb-6">
                I'm always open to discussing new projects, automation opportunities, 
                or partnerships to drive efficiency in your organization.
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href="mailto:mtaeyyab15@gmail.com" 
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">Connect via Email</div>
                </div>
              </a>

              <a 
                href="https://www.linkedin.com/in/muhammad-tayyab-96b052266/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">LinkedIn</div>
                  <div className="text-sm text-muted-foreground">Connect with me</div>
                </div>
              </a>

              <a 
                href="https://github.com/mtayyab153" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Github className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">View my repositories</div>
                </div>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <Input 
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={updateField("name")}
                required
                maxLength={LIMITS.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="bg-secondary focus:border-primary"
              />
              {errors.name && (
                <p id="name-error" className="mt-2 text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input 
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={updateField("email")}
                required
                maxLength={LIMITS.email}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="bg-secondary focus:border-primary"
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <Textarea 
                id="message"
                placeholder="Tell me about your project..."
                rows={5}
                value={formData.message}
                onChange={updateField("message")}
                required
                maxLength={LIMITS.message}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="bg-secondary focus:border-primary resize-none"
              />
              {errors.message && (
                <p id="message-error" className="mt-2 text-sm text-destructive">{errors.message}</p>
              )}
            </div>
            
  {formError && (
    <p role="alert" className="text-sm text-destructive">{formError}</p>
  )}

  <Button
    type="submit"
    aria-disabled={isLoading || cooldownLeft > 0}
    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold aria-disabled:opacity-80 aria-disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <span className="flex items-center justify-center gap-2">
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        Sending...
      </span>
    ) : cooldownLeft > 0 ? (
      <>Please wait {formatWait(cooldownLeft)}</>
    ) : (
      <>
        <Send className="w-4 h-4 mr-2" />
        Send Message
      </>
    )}
</Button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
