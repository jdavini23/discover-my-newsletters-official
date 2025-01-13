import * as Sentry from "@sentry/react";

class ErrorLoggingService {
  constructor() {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay()
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  logError(error: Error, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }

  logMessage(message: string, level: Sentry.Severity = 'info') {
    Sentry.captureMessage(message, level);
  }

  setUser(user?: { id: string; email?: string }) {
    Sentry.setUser(user || null);
  }
}

export const errorLoggingService = new ErrorLoggingService();
