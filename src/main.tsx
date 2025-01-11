// Essential Imports
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';
import type { GlobalTypes } from '@/types/global';

// Styles and Configuration
import './index.css';

// Components and Services
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { AuthService } from '@/services/authService';
import { trackError } from '@/utils/analytics';
import App from './App';

// Absolute last-resort error display
const ErrorDisplay = ({ error }: { error: unknown }) => {
  return (
    <div className='error-container'>
      <h1>🚨 Catastrophic Initialization Error</h1>
      <p>Something went wrong during application startup.</p>
      <details>
        <summary>Error Details</summary>
        <pre>{error instanceof Error ? error.message : JSON.stringify(error)}</pre>
      </details>
    </div>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [initError, setInitError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const handleInitializeAuth = useCallback(async () => {
    console.log('🚀 Application Initialization');
    const startupTimer = performance.now();
    console.log('🔍 Checking root element');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('❌ No root element found!');
      const noRootError = new Error('No root element found');
      trackError(noRootError, {
        context: 'root_element_missing',
      });
      setInitError(noRootError);
      return false;
    }
    
    try {
      console.log('🔍 Initializing authentication state');
      // Explicitly initialize Firebase
      const { initializeFirebase, auth, firestore } = await import('@/config/firebase');
      
      // Perform initialization
      const initializedFirebase = initializeFirebase();
      
      // Validate initialization
      if (!initializedFirebase.auth || !initializedFirebase.firestore) {
        throw new Error('Failed to initialize Firebase services');
      }
      
      console.log('✅ Authentication initialization complete');
      const endTimer = performance.now();
      console.log(`App Startup: ${endTimer - startupTimer} ms`);
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('❌ Authentication initialization FAILED:', error);
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
    return <ErrorDisplay error={initError} />;
  }
  
  if (!isInitialized) {
    return <LoadingSpinner fullScreen />;
  }
  
  return <>{children}</>;
};

console.log('🔍 Starting React Root Render');

try {
  // Diagnostic logging for DOM state
  console.log('Initial DOM state:', {
    documentBody: document.body,
    rootElement: document.getElementById('root'),
    bodyChildren: Array.from(document.body.children).map(el => el.id)
  });

  // Ensure a clean slate for rendering
  const rootElement = document.getElementById('root');
  
  // If root doesn't exist, create it
  if (!rootElement) {
    console.warn('🚨 Root element not found, creating new root');
    const newRootElement = document.createElement('div');
    newRootElement.id = 'root';
    document.body.appendChild(newRootElement);
  } else {
    // Safely clear the root element's contents
    console.log(`Clearing root element with ${rootElement.children.length} children`);
    // Use a more robust method to clear children
    Array.from(rootElement.children).forEach(child => {
      try {
        rootElement.removeChild(child);
      } catch (removeError) {
        console.error('Error removing child:', removeError);
      }
    });
  }
  
  // Create React root with error handling
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <ErrorBoundary
        fallback={({ error }) => (
          <div className='error-container'>
            <h1>Application Error</h1>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()}>Reload Application</button>
          </div>
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
            <App />
          </AppWrapper>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Fatal rendering error:', error);
  trackError(error as Error, {
    context: 'root_render_fatal',
  });
}
