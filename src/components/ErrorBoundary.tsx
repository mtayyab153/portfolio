import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere below it.
 *
 * Without this, a throw during render unmounts the whole tree and the visitor
 * is left on a blank page with no way to recover - the worst failure mode for
 * a client-rendered app. The fallback deliberately uses plain markup and
 * utility classes only, so it cannot itself depend on whatever broke.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Detail stays in the console during development. Production visitors see
    // only the panel below - no stack trace, no component names.
    if (import.meta.env.DEV) {
      console.error("Uncaught render error:", error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-primary">Error</p>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-4 text-muted-foreground">
            An unexpected error stopped the page from loading. Reloading usually fixes it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Reload page
            </button>
            <a
              href="/"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Back to home
            </a>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Still stuck? Email{" "}
            <a href="mailto:mtaeyyab15@gmail.com" className="text-primary hover:underline">
              mtaeyyab15@gmail.com
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
