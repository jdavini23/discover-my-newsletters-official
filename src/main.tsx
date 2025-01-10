import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { useAuthStore } from './stores/authStore';
import { NavigationProvider } from './contexts/NavigationContext';

export function AppWrapper() {
  return React.createElement(NavigationProvider, null, React.createElement(App));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  React.createElement(React.StrictMode, null, React.createElement(AppWrapper))
);
