import React, { Component, ErrorInfo, ReactNode } from 'react';

import { trackEvent } from '@/utils/analytics';

import ErrorFallback from './ErrorFallback';

// Enhanced error metadata interface
interface ErrorMetadata {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: ErrorMetadata) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: ErrorMetadata;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  // Static method to derive state from caught error
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: {
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
      },
    };
  }

  // Lifecycle method to handle error side effects
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorMetadata: ErrorMetadata = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
    };

    // Track error for monitoring
    trackEvent('error_boundary_catch', {
      message: errorMetadata.message,
      severity: 'critical',
    });

    // Optional custom error handler
    if (this.props.onError) {
      this.props.onError(errorMetadata);
    }
  }

  // Method to reset error state
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback or default ErrorFallback
      const FallbackComponent = this.props.fallback
        ? () => this.props.fallback as JSX.Element
        : () => (
            <ErrorFallback error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />
          );

      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
