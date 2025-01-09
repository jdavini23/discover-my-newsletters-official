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

// Enhanced event types
export const EventTypes = {
  // Recommendation Events
  RECOMMENDATION_GENERATED: 'recommendation_generated',
  RECOMMENDATION_INTERACTION: 'recommendation_interaction',
  RECOMMENDATION_FEEDBACK: 'recommendation_feedback',

  // Newsletter Events
  NEWSLETTER_SEARCH: 'newsletter_search',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  NEWSLETTER_VIEW: 'newsletter_view',
  NEWSLETTER_SAVE: 'newsletter_save',

  // User Journey Events
  ONBOARDING_START: 'onboarding_start',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_PREFERENCE_UPDATE: 'user_preference_update',

  // Performance Events
  PAGE_LOAD_TIME: 'page_load_time',
  API_RESPONSE_TIME: 'api_response_time',

  // Error Events
  RECOMMENDATION_ERROR: 'recommendation_error',
  NETWORK_ERROR: 'network_error',
  ERROR: 'error',
};

// Enhanced tracking context
interface TrackingContext {
  userId?: string;
  userSegment?: string;
  platform?: 'web' | 'mobile';
  source?: string;
}

// Performance tracking utility
export const performanceTracker = {
  markStart: (eventName: string) => {
    performance.mark(`${eventName}_start`);
  },

  markEnd: (eventName: string, context?: TrackingContext) => {
    performance.mark(`${eventName}_end`);
    performance.measure(eventName, `${eventName}_start`, `${eventName}_end`);

    const duration = performance.getEntriesByName(eventName)[0].duration;

    // Log performance metrics
    trackEvent(EventTypes.PAGE_LOAD_TIME, {
      duration,
      ...context,
    });

    // Clean up marks and measures
    performance.clearMarks(`${eventName}_start`);
    performance.clearMarks(`${eventName}_end`);
    performance.clearMeasures(eventName);
  },
};

// Advanced event tracking with more context
export const trackEvent = (
  eventName: string,
  eventData: Record<string, any> = {},
  context: TrackingContext = {}
) => {
  try {
    // Enrich event with context
    const enrichedEventData = {
      ...eventData,
      userId: context.userId || 'anonymous',
      userSegment: context.userSegment || 'undefined',
      platform: context.platform || 'web',
      source: context.source || 'unknown',
    };

    // Rate limit and log event
    if (!isRateLimited(eventName)) {
      plausibleInstance.trackEvent(eventName, enrichedEventData);

      // Optional: Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Event: ${eventName}`, enrichedEventData);
      }
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Recommendation tracking utility
export const recommendationTracker = {
  trackGeneration: (recommendations: any[], context: TrackingContext) => {
    trackEvent(
      EventTypes.RECOMMENDATION_GENERATED,
      {
        recommendationCount: recommendations.length,
        recommendationIds: recommendations.map((r) => r.id),
      },
      context
    );
  },

  trackInteraction: (
    newsletter: any,
    interactionType: 'view' | 'save' | 'share',
    context: TrackingContext
  ) => {
    trackEvent(
      EventTypes.RECOMMENDATION_INTERACTION,
      {
        newsletterId: newsletter.id,
        newsletterTitle: newsletter.title,
        interactionType,
      },
      context
    );
  },

  trackFeedback: (
    newsletter: any,
    feedbackType: 'positive' | 'negative',
    context: TrackingContext
  ) => {
    trackEvent(
      EventTypes.RECOMMENDATION_FEEDBACK,
      {
        newsletterId: newsletter.id,
        newsletterTitle: newsletter.title,
        feedbackType,
      },
      context
    );
  },
};

// Error tracking
export const trackError = (error: Error, context?: TrackingContext) => {
  try {
    const eventData: Record<string, any> = {
      message: error.message,
      stack: error.stack,
      severity: 'high',
    };

    trackEvent(EventTypes.ERROR, eventData, context);
  } catch (trackingError) {
    console.error('Error tracking failed:', trackingError);
  }
};

// Page view tracking
export const trackPageView = (path?: string, options?: { referrer?: string }) => {
  try {
    plausibleInstance.trackPageview({
      url: path,
      referrer: options?.referrer,
    });
  } catch (error) {
    console.error('Page view tracking failed:', error);
  }
};

// Default export for backwards compatibility
export default {
  trackEvent,
  trackError,
  trackPageView,
  performanceTracker,
  recommendationTracker,
  EventTypes,
};
