import React from 'react';
import { trackEvent } from '../utils/analytics';
import { React } from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  React.useEffect(() => {
    // Track error occurrence
    trackEvent('error_occurred', {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      severity: 'error',
    });
  }, [error]);

  return (
    <div
      className='flex flex-col items-center justify-center min-h-screen bg-red-50 p-6'
      role='alert'
    >
      <div className='max-w-md text-center'>
        <h2 className='text-3xl font-bold text-red-600 mb-4'>Oops! Something went wrong</h2>
        <p className='text-gray-700 mb-6'>
          We're sorry, but an unexpected error occurred. Please try again later.
        </p>

        {error && (
          <details
            className='text-sm text-gray-500 bg-white p-4 rounded-lg mb-6 max-h-40 overflow-auto'
            open
          >
            <summary className='cursor-pointer'>Error Details</summary>
            <pre className='whitespace-pre-wrap break-words'>{error.message}</pre>
          </details>
        )}

        <div className='flex space-x-4 justify-center'>
          <button
            onClick={() => window.location.reload()}
            className='mt-6 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition'
          >
            Reload Page
          </button>

          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className='mt-6 px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition'
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
