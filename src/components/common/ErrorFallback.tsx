interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    // Log the error for tracking
    React.useEffect(() => {
        trackError(error, {
            context: 'error_boundary_fallback'
        });
    }, [error]);
    return (<div className='flex flex-col items-center justify-center min-h-screen bg-red-50 p-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
        <AlertTriangle className='mx-auto mb-4 text-red-500' size={64}/>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>Oops! Something went wrong</h1>
        <p className='text-gray-600 mb-6'>
          We encountered an unexpected error. Don't worry, our team has been notified.
        </p>

        {/* Optional: Show error details in development */}
        {import.meta.env.DEV && (<details className='mb-6 text-left bg-gray-100 p-4 rounded-md overflow-auto max-h-48'>
            <summary className='cursor-pointer text-gray-700'>Error Details</summary>
            <pre className='text-xs text-red-700 whitespace-pre-wrap break-words'>
              {error.message}
              {error.stack && `\n\nStack Trace:\n${error.stack}`}
            </pre>
          </details>)}

        <div className='flex justify-center space-x-4'>
          <Button variant='outline' onClick={() => window.location.reload()}>
            Reload Page
          </Button>
          <Button variant='destructive' onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </div>
      </div>
    </div>);
};
export type  = default;
ErrorFallback;
import type { GlobalTypes } from '@/types/global';
import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { trackError } from '@/utils/analytics';
