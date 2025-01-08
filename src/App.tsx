import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/lib/react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

// Lazy load pages
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const NewsletterDiscoveryPage = React.lazy(() => import('@/pages/NewsletterDiscoveryPage'));
const NewsletterDetailPage = React.lazy(() => import('@/pages/NewsletterDetailPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AdminPromotionPage = React.lazy(() => import('@/pages/AdminPromotionPage'));
const RecommendationInsightsDashboard = React.lazy(() => import('@/pages/RecommendationInsightsDashboard'));

// Import Sidebar
import Sidebar from '@/components/navigation/Sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-grow p-8 ${isAuthenticated ? 'ml-64' : ''}`}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path='/auth'
                element={!isAuthenticated ? <AuthPage /> : <Navigate to='/newsletters' replace />}
              />
              <Route
                path='/newsletters'
                element={
                  <ProtectedRoute>
                    <NewsletterDiscoveryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/newsletters/:newsletterId'
                element={
                  <ProtectedRoute>
                    <NewsletterDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin-promotion'
                element={
                  <ProtectedRoute>
                    <AdminPromotionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/insights'
                element={
                  <ProtectedRoute requiredRole="admin">
                    <RecommendationInsightsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path='/' element={<HomePage />} />
              {/* Catch-all route to handle undefined routes */}
              <Route
                path='*'
                element={<Navigate to={isAuthenticated ? '/newsletters' : '/auth'} replace />}
              />
            </Routes>
          </Suspense>
          <Toaster position='top-right' />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
