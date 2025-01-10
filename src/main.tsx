import './index.css';

import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import { initializeAuth } from '@/config/firebase';
import { NavigationProvider } from './contexts/NavigationContext';
import App from './App.tsx';

// Absolute last-resort error display
const ErrorDisplay = ({ error }: { error: any }) => {
  return (
    <div className='error-container'>
      <h1>🚨 Catastrophic Initialization Error</h1>
      <p>Something went wrong during application startup.</p>
      <details>
        <summary>Error Details</summary>
        <pre>{error.message || JSON.stringify(error)}</pre>
      </details>
    </div>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [initError, setInitError] = useState<Error | null>(null);

  const handleInitializeAuth = useCallback(async () => {
    console.log('🚀 Application Initialization');
    const startupTimer = performance.now();

    console.log('🔍 Checking root element');
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('❌ No root element found!');
      setInitError(new Error('No root element found'));
      return false;
    }

    try {
      console.log('🔍 Initializing authentication state');
      await initializeAuth();

      console.log('✅ Authentication initialization complete');
      const endTimer = performance.now();
      console.log(`App Startup: ${endTimer - startupTimer} ms`);

      return true;
    } catch (error) {
      console.error('❌ Authentication initialization FAILED:', error);
      setInitError(error as Error);
      return false;
    }
  }, []);

  useEffect(() => {
    handleInitializeAuth();
  }, [handleInitializeAuth]);

  if (initError) {
    return <ErrorDisplay error={initError} />;
  }

  return <NavigationProvider>{children}</NavigationProvider>;
};

console.log('🔍 Starting React Root Render');
try {
  // Safely clear the root element
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // Remove all child nodes safely
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }
  }

  const root = ReactDOM.createRoot(rootElement!);
  root.render(
    <React.StrictMode>
      <ErrorBoundary fallback={<ErrorDisplay error='Unhandled React Error' />}>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('❌ Root render failed:', error);
}
