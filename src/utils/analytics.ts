// src/utils/analytics.ts
import Plausible from 'plausible-tracker';

// Comprehensive analytics configuration
export const ANALYTICS_CONFIG = {
  development: {
    domain: 'localhost',
    apiHost: 'http://localhost:3000',
    trackLocalhost: true,
    debug: true,
    enabled: true
  },
  production: {
    domain: 'discovermynewsletters.com',
    apiHost: 'https://api.discovermynewsletters.com',
    trackLocalhost: false,
    debug: false,
    enabled: true
  }
} as const;

// Determine current environment
const env = import.meta.env.MODE as keyof typeof ANALYTICS_CONFIG;
const config = ANALYTICS_CONFIG[env];

// Define event options type
interface EventOptions {
  userId?: string;
  userSegment?: string;
  platform?: 'web' | 'mobile';
  source?: string;
  [key: string]: any;
}

// Tracking context for additional metadata
export interface TrackingContext {
  userId?: string;
  userSegment?: string;
  platform?: 'web' | 'mobile';
  source?: string;
}

// Analytics service with comprehensive tracking capabilities
class AnalyticsService {
  private plausibleInstance: any;
  private segmentInstance: any;
  private mixpanelInstance: any;

  constructor() {
    this.initializeTrackers();
  }

  private initializeTrackers() {
    // Initialize Plausible instance
    this.plausibleInstance = config.enabled
      ? Plausible({
          domain: config.domain,
          apiHost: config.apiHost,
          trackLocalhost: config.trackLocalhost,
        })
      : {
          trackEvent: () => {},
          trackPageview: () => {},
        };
  }

  // Track custom events with comprehensive metadata
  trackEvent(
    eventName: string, 
    eventData?: EventOptions, 
    context?: TrackingContext
  ): void {
    const enrichedEventData: EventOptions = {
      platform: 'web',
      source: 'web_app',
      ...eventData,
      ...context
    };

    try {
      // Plausible tracking
      if (this.plausibleInstance) {
        this.plausibleInstance.trackEvent(eventName, enrichedEventData);
      }
    } catch (error) {
      this.trackError(error as Error, context);
    }
  }

  // Track errors with context
  trackError(
    error: Error, 
    context?: TrackingContext
  ): void {
    const errorData: EventOptions = {
      errorName: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      ...context
    };

    console.error('Tracking Error:', errorData);

    // Placeholder for error tracking services
    if (config.enabled && config.debug) {
      this.trackEvent('error', errorData);
    }
  }

  // Track page views
  trackPageView(
    path?: string, 
    options?: { 
      referrer?: string; 
      context?: TrackingContext 
    }
  ): void {
    const pageViewData: EventOptions = {
      path: path || window.location.pathname,
      referrer: options?.referrer || document.referrer,
      ...options?.context
    };

    this.trackEvent('page_view', pageViewData);
  }

  // Performance tracking utilities
  get performanceTracker() {
    return {
      trackPageLoad: () => {
        const timing = window.performance.timing;
        this.trackEvent('page_load_performance', {
          loadTime: timing.loadEventEnd - timing.navigationStart
        });
      }
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
      }
    };
  }
}

// Singleton instance of analytics service
const analytics = new AnalyticsService();

// Export tracking methods for direct use
export const { 
  trackEvent, 
  trackError, 
  trackPageView 
} = analytics;

export default analytics;
