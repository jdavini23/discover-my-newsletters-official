// src/utils/analytics.ts
import Plausible from 'plausible-tracker';

// Configuration for different environments
const ANALYTICS_CONFIG = {
  development: {
    domain: 'localhost',
    apiHost: 'https://plausible.io', // Or your self-hosted Plausible instance
    trackLocalhost: false, // Disable tracking in development
    debug: true,
    enabled: false, // Completely disable analytics in development
  },
  production: {
    domain: 'your-domain.com', // Replace with your actual domain
    apiHost: 'https://plausible.io',
    trackLocalhost: false,
    debug: false,
    enabled: true,
  },
};

// Determine current environment
const env = process.env.NODE_ENV || 'development';
const config = ANALYTICS_CONFIG[env];

// Dummy no-op tracker for development
const noOpTracker = {
  enableAutoPageviews: () => {},
  trackEvent: () => {},
  trackPageview: () => {},
};

// Initialize Plausible instance
const plausibleInstance = config.enabled
  ? Plausible({
      domain: config.domain,
      apiHost: config.apiHost,
      trackLocalhost: config.trackLocalhost,
    })
  : noOpTracker;

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxEventsPerMinute: 10, // Adjust based on Plausible's rate limits
  eventQueue: [] as { timestamp: number; eventName: string }[],
};

// Rate limiting function
const isRateLimited = (eventName: string): boolean => {
  const now = Date.now();

  // Remove events older than 1 minute
  RATE_LIMIT_CONFIG.eventQueue = RATE_LIMIT_CONFIG.eventQueue.filter(
    (event) => now - event.timestamp < 60000
  );

  // Check if we've exceeded max events per minute
  if (RATE_LIMIT_CONFIG.eventQueue.length >= RATE_LIMIT_CONFIG.maxEventsPerMinute) {
    console.warn(`[Analytics] Rate limit exceeded. Skipping event: ${eventName}`);
    return true;
  }

  // Add current event to queue
  RATE_LIMIT_CONFIG.eventQueue.push({ timestamp: now, eventName });
  return false;
};

// Initialize analytics
export const initAnalytics = () => {
  try {
    // Only enable auto pageviews if analytics is enabled
    if (config.enabled) {
      plausibleInstance.enableAutoPageviews();

      if (config.debug) {
        console.log('[Analytics] Initialized with config:', config);
      }
    } else {
      console.log('[Analytics] Disabled in current environment');
    }
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
};

// Define a more specific type for error context
interface ErrorContext {
  [key: string]: string | number | boolean | null | undefined;
}

// Define a more specific type for event data
type EventData = {
  message: string;
  stack?: string;
  context?: ErrorContext;
  severity: string;
  query?: string;
  source?: string;
};

// Enhanced event tracking
export const trackEvent = (
  eventName: string,
  eventData: EventData,
  options: {
    nonInteraction?: boolean;
    category?: string;
  } = {}
) => {
  // Skip tracking if analytics is disabled or rate limited
  if (!config.enabled || isRateLimited(eventName)) return;

  try {
    // Prepare event data
    const enhancedEventData = {
      props: {
        category: options.category || 'general',
        ...eventData,
        timestamp: new Date().toISOString(),
      },
    };

    // Track event with Plausible
    try {
      // Use trackEvent method from the Plausible instance
      plausibleInstance.trackEvent(eventName, enhancedEventData.props);

      // Optional: Log to console in development
      if (config.debug) {
        console.log(`[Analytics] Event: ${eventName}`, enhancedEventData);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Analytics event preparation error:', error);
  }
};

// Error tracking
export const trackError = (error: Error, context?: ErrorContext) => {
  try {
    const eventData: EventData = {
      message: error.message,
      stack: error.stack,
      context,
      severity: 'high',
    };

    trackEvent('error', eventData, {
      nonInteraction: true,
    });
  } catch (trackingError) {
    console.error('Error tracking failed:', trackingError);
  }
};

// Page view tracking
export const trackPageView = (path?: string, options?: { referrer?: string }) => {
  // Skip tracking if analytics is disabled
  if (!config.enabled) return;

  try {
    plausibleInstance.trackPageview({
      url: path || window.location.href,
      referrer: options?.referrer || document.referrer,
    });
  } catch (error) {
    console.error('Page view tracking error:', error);
  }
};

// Custom event types for better type checking
export const EventTypes = {
  NEWSLETTER_SEARCH: 'newsletter_search',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  NEWSLETTER_VIEW: 'newsletter_view',
  ERROR: 'error',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export default {
  trackEvent,
  trackError,
  trackPageView,
  EventTypes,
};
