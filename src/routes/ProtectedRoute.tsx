import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import Loader from '@/components/common/Loader';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the current location they were trying to access
    return <Navigate to='/auth' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
