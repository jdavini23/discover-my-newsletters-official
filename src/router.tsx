import React, { Suspense, lazy } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/navigation/Sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load pages for performance
const Dashboard = lazy(() => import('@/pages/DashboardPage'));
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'));
const RecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'));
const RecommendationInsightsDashboard = lazy(() => import('@/pages/RecommendationInsightsDashboard'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const AdminPromotionPage = lazy(() => import('@/pages/AdminPromotionPage'));

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'any';
}> = ({ children, requiredRole = 'user' }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole !== 'any') {
    if (requiredRole === 'admin' && user?.role !== 'admin') {
      return <Navigate to="/admin-promotion" replace />;
    }
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-grow p-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <ProtectedRoute>
                    <DiscoverPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recommendations" 
                element={
                  <ProtectedRoute>
                    <RecommendationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-promotion" 
                element={
                  <ProtectedRoute>
                    <AdminPromotionPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/insights" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <RecommendationInsightsDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
