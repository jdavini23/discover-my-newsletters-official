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

  if (loading) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    console.log('[ProtectedRoute] No user, redirecting to signup');
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
