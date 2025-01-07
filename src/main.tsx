import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useAuthStore } from './stores/authStore';

export function AppWrapper() {
  // Initialize auth when the app starts
  React.useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
