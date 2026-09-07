/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  /** Optional. When unset, the contact form runs without a captcha. */
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  grecaptcha?: {
    render: (el: HTMLElement, opts: { sitekey: string; theme?: "light" | "dark" }) => number;
    getResponse: (widgetId?: number) => string;
    reset: (widgetId?: number) => void;
  };
  onRecaptchaLoad?: () => void;
}
