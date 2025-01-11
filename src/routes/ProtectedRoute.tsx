import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'user' | 'admin' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'user' }) => {
    const { user, isAuthenticated, loading, refreshUser } = useAuthStore();

    // Attempt to refresh user on mount if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !loading) {
            refreshUser().catch((error) => {
                console.error('Failed to refresh user in ProtectedRoute:', error);
            });
        }
    }, [isAuthenticated, loading, refreshUser]);

    // Show loading spinner while authentication is being initialized
    if (loading) {
        return <LoadingSpinner fullScreen/>;
    }

    // Check authentication status
    if (!isAuthenticated) {
        return <Navigate to='/auth' replace/>;
    }

    // Check role-based access
    if (requiredRole !== 'any') {
        if (requiredRole === 'admin' && user?.role !== 'admin') {
            return <Navigate to='/admin-promotion' replace/>;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
