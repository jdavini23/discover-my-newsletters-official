import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Sidebar
import Sidebar from '@/components/navigation/Sidebar';

// Import Navigation
import Navigation from '@/components/layout/Navigation';

// Import LoadingSpinner
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Import Toaster
import { Toaster } from 'react-hot-toast';

// Context Providers
import { NavigationProvider } from '@/contexts/NavigationContext';

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
    <NavigationProvider>
      <BrowserRouter>
        <div className='flex'>
          {/* Add Navigation at the top */}
          <Navigation />
          
          {/* Conditionally render Sidebar only when authenticated */}
          {isAuthenticated && <Sidebar.default />}
          
          <main className={`flex-grow p-8 ${isAuthenticated ? 'ml-64' : ''} mt-16`}> {/* Add top margin for Navigation */}
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

        {/* Global Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 4000 },
          }}
        />
      </BrowserRouter>
    </NavigationProvider>
  );
}

export default App;
