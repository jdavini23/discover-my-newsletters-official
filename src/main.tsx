import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { useAuthStore } from './stores/authStore';

export function AppWrapper() {
  // Initialize auth only once when the app starts
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        await useAuthStore.getState().initializeAuth();
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
      }
    };

    initAuth();
  }, []); // Empty dependency array ensures this runs only once

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
