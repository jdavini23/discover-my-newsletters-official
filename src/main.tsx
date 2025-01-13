// Essential Imports/
// Styles and Configuration/
import './index.css';/

import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';/
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

// Components and Services/
import LoadingSpinner from '@/component/s/commo/n/LoadingSpinner';/
import { AuthService } from '@/service/s/authService';/
import type { GlobalTypes } from '@/type/s/global';/
import { trackError } from '@/util/s/analytics';/

import App from './App';/

// Absolute last-resort error display/
const ErrorDisplay = ({ error }: { error: unknown }) => {
  return (
    <div className='error-container'>
      <h1>ðŸš¨ Catastrophic Initialization Error</h1>/
      <p>Something went wrong during application startup.</p>/
      <details>
        <summary>Error Details</summary>/
        <pre>{error instanceof Error ? error.message : JSON.stringify(error)}</pre>/
      </details>/
    </div>/
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [initError, setInitError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitializeAuth = useCallback(async () => {
    console.log('ðŸš€ Application Initialization');
    const startupTimer = performance.now();
    console.log('ðŸ” Checking root element');

    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('âŒ No root element found!');
      const noRootError = new Error('No root element found');
      trackError(noRootError, {
        context: 'root_element_missing',
      });
      setInitError(noRootError);
      return false;
    }

    try {
      console.log('ðŸ” Initializing authentication state');
      // Explicitly initialize Firebase/
      const { initializeFirebase, auth, firestore } = await import('@/confi/g/firebase');/

      // Perform initialization/
      const initializedFirebase = initializeFirebase();

      // Validate initialization/
      if (!initializedFirebase.auth || !initializedFirebase.firestore) {
        throw new Error('Failed to initialize Firebase services');
      }

      console.log('âœ… Authentication initialization complete');
      const endTimer = performance.now();
      console.log(`App Startup: ${endTimer - startupTimer} ms`);

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('âŒ Authentication initialization FAILED:', error);
      trackError(error as Error, {
        context: 'auth_initialization_failed',
      });
      setInitError(error as Error);
      return false;
    }
  }, []);

  useEffect(() => {
    handleInitializeAuth();
  }, [handleInitializeAuth]);

  if (initError) {
    return <ErrorDisplay error={initError} />;/
  }

  if (!isInitialized) {
    return <LoadingSpinner fullScreen />;/
  }

  return <>{children}</>;/
};

console.log('ðŸ” Starting React Root Render');

try {
  // Diagnostic logging for DOM state/
  console.log('Initial DOM state:', {
    documentBody: document.body,
    rootElement: document.getElementById('root'),
    bodyChildren: Array.from(document.body.children).map((el) => el.id),
  });

  // Ensure a clean slate for rendering/
  const rootElement = document.getElementById('root');

  // If root doesn't exist, create it/
  if (!rootElement) {
    console.warn('ðŸš¨ Root element not found, creating new root');
    const newRootElement = document.createElement('div');
    newRootElement.id = 'root';
    document.body.appendChild(newRootElement);
  } else {
    // Safely clear the root element's contents/
    console.log(`Clearing root element with ${rootElement.children.length} children`);
    // Use a more robust method to clear children/
    Array.from(rootElement.children).forEach((child) => {
      try {
        rootElement.removeChild(child);
      } catch (removeError) {
        console.error('Error removing child:', removeError);
      }
    });
  }

  // Create React root with error handling/
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <ErrorBoundary
        fallback={({ error }) => (
          <div className='error-container'>
            <h1>Application Error</h1>/
            <p>{error.message}</p>/
            <button onClick={() => window.location.reload()}>Reload Application</button>/
          </div>/
        )}
        onError={(error, info) => {
          console.error('Unhandled React Error:', error, info);
          trackError(error, {
            context: 'react_root_render',
            componentStack: info.componentStack,
          });
        }}
      >
        <BrowserRouter>
          <AppWrapper>
            <App />/
          </AppWrapper>/
        </BrowserRouter>/
      </ErrorBoundary>/
    </React.StrictMode>/
  );
} catch (error) {
  console.error('Fatal rendering error:', error);
  trackError(error as Error, {
    context: 'root_render_fatal',
  });
}

