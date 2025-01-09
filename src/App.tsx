import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Sidebar
import Sidebar from '@/components/navigation/Sidebar';

// Import LoadingSpinner
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Authentication and Protected Routes
import { useAuthStore } from '@/stores/authStore';

// Lazy-loaded pages
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const NewsletterDiscoveryPage = React.lazy(() => import('@/pages/NewsletterDiscoveryPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const AdminPromotionPage = React.lazy(() => import('@/pages/AdminPromotionPage'));
const RecommendationsPage = React.lazy(() => import('@/pages/RecommendationsPage'));
const InsightsPage = React.lazy(() => import('@/pages/InsightsPage'));
const AdminDashboardPage = React.lazy(() => import('@/pages/AdminDashboardPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'any';
}> = ({ children, requiredRole = 'user' }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while authentication is being initialized
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check authentication status
  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />;
  }

  // Check role-based access
  if (requiredRole !== 'any') {
    if (requiredRole === 'admin' && user?.role !== 'admin') {
      return <Navigate to='/admin-promotion' replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <div className='flex'>
        {/* Conditionally render Sidebar only when authenticated */}
        {isAuthenticated && <Sidebar />}
        
        <main className={`flex-grow p-8 ${isAuthenticated ? 'ml-64' : ''}`}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path='/auth' element={<AuthPage />} />
              <Route
                path='/newsletters'
                element={
                  <ProtectedRoute>
                    <NewsletterDiscoveryPage />
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
                path='/settings'
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/recommendations'
                element={
                  <ProtectedRoute>
                    <RecommendationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin-promotion'
                element={
                  <ProtectedRoute requiredRole='user'>
                    <AdminPromotionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin'
                element={
                  <ProtectedRoute requiredRole='admin'>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/insights'
                element={
                  <ProtectedRoute requiredRole='admin'>
                    <InsightsPage />
                  </ProtectedRoute>
                }
              />
              <Route path='/' element={<HomePage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
