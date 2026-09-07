# Portfolio — Muhammad Tayyab

Personal portfolio site for an Automation / RPA engineer. React SPA built with
Vite, deployed on Vercel, with a serverless contact endpoint.

**Live:** https://portfolio-ruddy-rho-kp18n9lm55.vercel.app

## Tech stack

- ⚡ **Vite** — build tool
- ⚛️ **React 18** + **TypeScript**
- 🎨 **Tailwind CSS** + **shadcn/ui**
- ▲ **Vercel** — static hosting + serverless functions

## Architecture

The site is a static SPA with one server-side endpoint:

```
Browser ──POST /api/contact──> Vercel function ──> EmailJS ──> inbox
```

The contact form does **not** call EmailJS from the browser. Credentials live
only in server-side environment variables, so nothing sensitive is compiled
into the client bundle. The function also enforces validation and rate limits
that a client-side form cannot, since an attacker can skip the page entirely
and call the endpoint directly.

| Path | Purpose |
|---|---|
| `src/` | React application |
| `api/contact.ts` | Serverless contact endpoint (validation, rate limiting, mail send) |
| `vercel.json` | Security headers, including the Content-Security-Policy |

## Getting started

```sh
git clone https://github.com/mtayyab153/portfolio
cd portfolio
npm install
```

### Environment variables

All four EmailJS values are **server-side only**. They must **not** be prefixed
with `VITE_` — that prefix compiles a value into the public JavaScript bundle,
where anyone can read it.

Create a `.env` in the project root (same level as `package.json`):

```sh
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
ALLOWED_ORIGIN=http://localhost:3000
```

`EMAILJS_PRIVATE_KEY` is a real secret. It requires **Account → Security →
"Allow EmailJS API for non-browser applications"** to be enabled in the EmailJS
dashboard, since the function is not a browser.

For deployment, set the same variables in **Vercel → Settings → Environment
Variables**, with `ALLOWED_ORIGIN` set to the production URL. Vercel bakes
variables in at build time, so **adding or changing one requires a redeploy**.

`.env` is gitignored and must never be committed.

### Running locally

```sh
npm run dev      # Vite only — http://localhost:8080
```

⚠️ `npm run dev` does **not** serve `/api`, so the contact form will 404. To run
the frontend and the serverless function together:

```sh
npm i -g vercel
vercel dev       # http://localhost:3000
```

Use `vercel dev` whenever you are working on the contact form.

### Other commands

```sh
npm run build    # production build to dist/
npm run preview  # serve the built output
npm run lint     # eslint
npx tsc --noEmit -p tsconfig.app.json   # typecheck the app
npx tsc --noEmit -p tsconfig.api.json   # typecheck api/
```

## Contact endpoint

`POST /api/contact` — JSON body `{ name, email, message }`.

| Response | Meaning |
|---|---|
| `200` | Sent |
| `400` | Validation failed (missing field, bad email, over length) |
| `403` | Origin not in `ALLOWED_ORIGIN` |
| `405` | Method other than POST |
| `429` | Rate limited — see `Retry-After` |
| `500` | Server misconfigured (missing environment variable) |
| `502` | EmailJS rejected the request |

Limits: name ≤ 100, email ≤ 254, message ≤ 2000 characters; 1 message per
minute and 3 per hour per IP.

Rate limiting is an in-memory map, which is best-effort on serverless — it
bounds bursts against a warm instance rather than a distributed attacker. The
EmailJS account quota is the hard backstop. Swap in Redis if that stops being
good enough.

## Security notes

- Security headers, including a CSP, are set in `vercel.json`. `connect-src` is
  `'self'` — the page has no cross-origin fetch destination, so the contact form
  provably cannot bypass the endpoint.
- No secrets reach the browser. Any new variable intended for client use must be
  prefixed `VITE_`, and that prefix means public.
- Keep **Allowed Origins** configured in the EmailJS dashboard as a second layer.
