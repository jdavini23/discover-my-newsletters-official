import React, { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useNavigate } from 'react-router-dom';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import NotificationDropdown from '@/components/navigation/NotificationDropdown';
// Import components
import Sidebar from '@/components/navigation/Sidebar';
import TopNavbar from '@/components/navigation/TopNavbar';
import UserProfileDropdown from '@/components/navigation/UserProfileDropdown';
import { initializeFirebase } from '@/config/firebase';
// Import providers
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import AppRoutes from '@/routes/AppRoutes';
import { AuthService } from '@/services/authService';
// Import services and stores
import { AuthState, useAuthStore } from '@/stores/authStore';
// Import types
import type { GlobalTypes } from '@/types/global';

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className='error-container' role='alert'>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const App: React.FC = () => {
  // Combine initialization states
  const [appState, setAppState] = useState<{
    isInitialized: boolean;
    isClientSide: boolean;
    initError: Error | null;
  }>({
    isInitialized: false,
    isClientSide: false,
    initError: null,
  });
  // Use the auth store hook consistently
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // Combine initialization effects
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Safely clear any existing content - use a safer method
        const rootElement = document.getElementById('root');
        if (rootElement) {
          while (rootElement.firstChild) {
            rootElement.removeChild(rootElement.firstChild);
          }
        }

        // Perform initialization steps
        const authService = AuthService.getInstance();

        // Initialize Firebase first
        initializeFirebase();

        // Set the external updater for auth state
        const updateAuthStore = (state: Partial<AuthState>) => {
          useAuthStore.setState(state);
        };
        authService.setAuthStoreUpdater(updateAuthStore);

        // Initialize authentication
        await authService.initializeAuth();

        // Update state
        setAppState({
          isInitialized: true,
          isClientSide: true,
          initError: null,
        });
      } catch (error) {
        console.error('App initialization failed:', error);
        setAppState({
          isInitialized: false,
          isClientSide: true,
          initError: error instanceof Error ? error : new Error('Unknown initialization error'),
        });
      }
    };

    initializeApp();
  }, []); // Empty dependency array ensures this runs only once

  // Memoize rendering logic
  const renderContent = useMemo(() => {
    // Prevent rendering on server-side
    if (!appState.isClientSide) {
      return null;
    }
    // Error boundary fallback
    if (appState.initError) {
      return (
        <div className='error-container'>
          <h1>Application Initialization Error</h1>
          <p>{appState.initError.message}</p>
          <button onClick={() => window.location.reload()}>Reload Application</button>
        </div>
      );
    }
    // Loading state
    if (!appState.isInitialized) {
      return <LoadingSpinner />;
    }
    // Main application render
    return (
      <AuthProvider>
        <NavigationProvider>
          <div className='app-container flex flex-col min-h-screen'>
            <TopNavbar />
            <div className='flex flex-grow mt-16'>
              {isAuthenticated && <Sidebar />}
              <main className='main-content flex-grow'>
                <AppRoutes />
              </main>
            </div>
          </div>
        </NavigationProvider>
      </AuthProvider>
    );
  }, [appState, isAuthenticated, location, navigate]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      {renderContent}
    </ErrorBoundary>
  );
};

export default App;
