import { analytics } from '../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

class ErrorLoggingService {
  /**
   * Log an error with optional context
   * @param error - The error object
   * @param context - Additional context about the error
   */
  logError(error: Error, context?: Record<string, any>) {
    // Log to console for local development
    console.error('Logged Error:', error, context);

    // Log to Firebase Analytics
    try {
      logEvent(analytics, 'exception', {
        description: error.message,
        fatal: false,
        stack: error.stack,
        userId: this.getCurrentUserId(),
        ...context
      });
    } catch (analyticsError) {
      console.error('Failed to log error to analytics:', analyticsError);
    }
  }

  /**
   * Log a custom event
   * @param eventName - Name of the event
   * @param eventData - Additional data about the event
   */
  logEvent(eventName: string, eventData?: Record<string, any>) {
    try {
      logEvent(analytics, eventName, {
        ...eventData,
        environment: import.meta.env.MODE, // development, production, etc.
        userId: this.getCurrentUserId()
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  /**
   * Track user interactions
   * @param action - User action description
   * @param category - Category of the action
   */
  trackUserAction(action: string, category: string = 'general') {
    this.logEvent('user_action', { 
      action, 
      category
    });
  }

  /**
   * Get current user ID (if logged in)
   * @returns User ID or undefined
   */
  private getCurrentUserId(): string | undefined {
    const auth = getAuth();
    return auth.currentUser?.uid;
  }

  /**
   * Log performance metrics
   * @param metricName - Name of the performance metric
   * @param value - Numeric value of the metric
   */
  logPerformance(metricName: string, value: number) {
    this.logEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value
    });
  }
}

export const errorLoggingService = new ErrorLoggingService();
