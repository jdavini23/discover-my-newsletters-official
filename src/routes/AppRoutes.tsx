import * as React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignUp from '../components/auth/SignUp';
import Login from '../components/auth/Login';
import Dashboard from '../pages/Dashboard';
import PreferencesPage from '../pages/PreferencesPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';
import NewsletterDiscovery from '../pages/NewsletterDiscovery';
import AnalyticsDashboard from '../pages/AnalyticsDashboard'; 

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  React.useEffect(() => {
    console.log('[AppRoutes] Current route:', { pathname: location.pathname });
  }, [location]);

  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<Home />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
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
      <Route 
        path="/discover" 
        element={
          <ProtectedRoute>
            <NewsletterDiscovery />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
