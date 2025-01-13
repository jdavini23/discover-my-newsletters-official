import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] Checking auth:', { 
    hasUser: !!currentUser, 
    loading,
    pathname: location.pathname
  });

  // If still loading, show a loading state or null
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user, redirect to signup
  if (!currentUser) {
    console.log('[ProtectedRoute] No user, redirecting to signup');
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  // If user exists, render children
  return <>{children}</>;
};

export default ProtectedRoute;
