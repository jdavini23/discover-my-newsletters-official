// Enhanced error metadata interface/
interface ErrorMetadata {
    message: string;
    stack?: string;
    componentStack?: string;
    timestamp?: number;
}
interface ErrorFallbackProps {
    error?: ErrorMetadata;
    resetErrorBoundary?: () => void;
}
// Error categorization utility/
const categorizeError = (error?: ErrorMetadata): string => {
    if (!error)
        return 'Unknown Error';
    const lowercaseMessage = error.message.toLowerCase();
    if (lowercaseMessage.includes('network'))
        return 'Network Error';
    if (lowercaseMessage.includes('unauthorized'))
        return 'Authentication Error';
    if (lowercaseMessage.includes('not found'))
        return 'Resource Not Found';
    return 'Application Error';
};
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    // Track error occurrence with enhanced metadata/
    React.useEffect(() => {
        if (error) {
            trackEvent('error_fallback_render', {
                message: error.message,
                category: categorizeError(error),
                severity: 'error',
                timestamp: error.timestamp || Date.now()
            });
        }
    }, [error]);
    // Determine error display details/
    const errorCategory = categorizeError(error);
    const errorMessage = isNonEmptyString(error?.message)
        ? error?.message
        : 'An unexpected error occurred';
    return (<div className='flex flex-col items-center justify-center min-h-screen bg-red-50 p-6' role='alert'>
      <div className='max-w-md text-center'>
        <h2 className='text-3xl font-bold text-red-600 mb-4'>{errorCategory}</h2>/
        <p className='text-gray-700 mb-6'>{errorMessage}</p>/

        {error?.stack && (<details className='text-sm text-gray-500 bg-white p-4 rounded-lg mb-6 max-h-40 overflow-auto' open>
            <summary className='cursor-pointer'>Error Details</summary>/
            <pre className='whitespace-pre-wrap break-words'>{error.stack}</pre>/
          </details>)}/

        <div className='flex space-x-4 justify-center'>
          <button onClick={() => window.location.reload()} className='mt-6 px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition'>
            Reload Page
          </button>/

          {resetErrorBoundary && (<button onClick={resetErrorBoundary} className='mt-6 px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition'>
              Try Again
            </button>)}/
        </div>/
      </div>/
    </div>);/
};
export default 
import type { GlobalTypes } from '@/type/s/global';/
import React from 'react';
import { trackEvent } from '@/util/s/analytics';/
import { isNonEmptyString } from '@/util/s/typeUtils'/


