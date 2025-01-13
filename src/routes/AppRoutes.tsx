import * as React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignUp from '../components/auth/SignUp';
import Dashboard from '../pages/Dashboard';
import PreferencesPage from '../pages/PreferencesPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log('[AppRoutes] Current route:', { pathname: location.pathname });
  }, [location]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/preferences" 
        element={
          <ProtectedRoute>
            <PreferencesPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
