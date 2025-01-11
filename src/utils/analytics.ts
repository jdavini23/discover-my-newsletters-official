import Plausible from 'plausible-tracker';

// Comprehensive analytics configuration
export const ANALYTICS_CONFIG = {
  debug: import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'localhost',
  plausibleApiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'http://localhost:3000',
};

// Define event options type
export interface EventOptions {
  userId?: string;
  userSegment?: string;
  platform?: 'web' | 'mobile';
  source?: string;
  [key: string]: unknown;
}

// Tracking context for additional metadata
export interface TrackingContext {
  userId?: string;
  userSegment?: string;
  platform?: 'web' | 'mobile';
  source?: string;
  componentStack?: string;
  context?: string;
}

// Analytics service with comprehensive tracking capabilities
class AnalyticsService {
  private plausibleInstance: unknown;
  constructor() {
    this.initializeTrackers();
  }
  private initializeTrackers() {
    try {
      // Only initialize if analytics is enabled and in production
      const isAnalyticsEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
      if (isAnalyticsEnabled && import.meta.env.PROD) {
        this.plausibleInstance = Plausible({
          domain: ANALYTICS_CONFIG.plausibleDomain,
          apiHost: ANALYTICS_CONFIG.plausibleApiHost,
          trackLocalhost: true,
        });
        console.log('📊 Analytics Initialized:', {
          domain: ANALYTICS_CONFIG.plausibleDomain,
          apiHost: ANALYTICS_CONFIG.plausibleApiHost,
        });
      } else {
        console.warn('🚫 Analytics tracking is disabled');
        this.plausibleInstance = null;
      }
    } catch (error) {
      console.error('❌ Failed to initialize analytics:', error);
      this.plausibleInstance = null;
    }
  }
  // Track events with comprehensive error handling
  trackEvent(eventName: string, eventData?: EventOptions, context?: TrackingContext): void {
    // Skip tracking if analytics is disabled
    const isAnalyticsEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
    if (!isAnalyticsEnabled) {
      if (ANALYTICS_CONFIG.debug) {
        console.log('🔍 Analytics Tracking Skipped:', {
          eventName,
          eventData,
          context,
        });
      }
      return undefined;
    }
    const enrichedEventData: EventOptions = {
      platform: 'web',
      source: 'web_app',
      ...eventData,
      ...context,
    };
    try {
      // Plausible tracking with robust error handling
      if (this.plausibleInstance) {
        try {
          this.plausibleInstance.trackEvent(eventName, enrichedEventData);
        } catch (plausibleError) {
          console.warn('⚠️ Plausible tracking failed:', plausibleError);
          // Optionally log to a fallback error tracking service
        }
      }
    } catch (error) {
      console.error('🚨 Event Tracking Error:', {
        eventName,
        error,
        eventData: enrichedEventData,
      });
    }
  }
  // Track errors with context
  trackError(error: Error, context?: TrackingContext): void {
    const errorData: EventOptions = {
      errorName: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      ...context,
    };
    console.error('Tracking Error:', errorData);
    // Placeholder for error tracking services
    const isAnalyticsEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
    if (isAnalyticsEnabled && ANALYTICS_CONFIG.debug) {
      this.trackEvent('error', errorData);
    }
  }
  // Track page views
  trackPageView(
    path?: string,
    options?: {
      referrer?: string;
      context?: TrackingContext;
    }
  ): void {
    const pageViewData: EventOptions = {
      path: path || window.location.pathname,
      referrer: options?.referrer || document.referrer,
      ...options?.context,
    };
    this.trackEvent('page_view', pageViewData);
  }
  // Performance tracking utilities
  get performanceTracker() {
    return {
      trackPageLoad: () => {
        const timing = window.performance.timing;
        this.trackEvent('page_load_performance', {
          loadTime: timing.loadEventEnd - timing.navigationStart,
        });
      },
    };
  }
  // Recommendation tracking utilities
  get recommendationTracker() {
    return {
      trackRecommendationView: (newsletterId: string) => {
        this.trackEvent('recommendation_viewed', { newsletterId });
      },
      trackRecommendationClick: (newsletterId: string) => {
        this.trackEvent('recommendation_clicked', { newsletterId });
      },
    };
  }
}
// Singleton instance of analytics service
const analytics = new AnalyticsService();

export function trackEvent(eventName: string, eventData?: EventOptions, context?: TrackingContext) {
  analytics.trackEvent(eventName, eventData, context);
}

export function trackError(error: Error, context?: TrackingContext) {
  analytics.trackError(error, context);
}

export function trackPageView(
  path?: string,
  options?: {
    referrer?: string;
    context?: TrackingContext;
  }
) {
  analytics.trackPageView(path, options);
}

export const recommendationTracker = {
  trackRecommendationView: (newsletterId: string, context?: TrackingContext) => 
    analytics.recommendationTracker.trackRecommendationView(newsletterId, context),
  
  trackRecommendationClick: (newsletterId: string, context?: TrackingContext) => 
    analytics.recommendationTracker.trackRecommendationClick(newsletterId, context),
  
  trackRecommendationFeedback: (
    newsletterId: string,
    feedback: 'positive' | 'negative',
    context?: TrackingContext
  ) => analytics.trackEvent('recommendation_feedback', { newsletterId, feedback }, context)
};

export default analytics;

import type { GlobalTypes } from '@/types/global';
