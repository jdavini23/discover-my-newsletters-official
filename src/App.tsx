import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Layout Components
import Navigation from '@/components/layout/Navigation';
import { Sidebar } from '@/components/navigation/Sidebar';
// Contexts
import { ThemeProvider } from '@/contexts/ThemeContext';

// Lazy-loaded Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const NewsletterDiscoveryPage = React.lazy(() => import('@/pages/NewsletterDiscoveryPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const AdminPromotionPage = React.lazy(() => import('@/pages/AdminPromotionPage'));
const RecommendationsPage = React.lazy(() => import('@/pages/RecommendationsPage'));
const InsightsPage = React.lazy(() => import('@/pages/InsightsPage'));
const AdminDashboardPage = React.lazy(() => import('@/pages/AdminDashboardPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));

// Loading Fallback Component
import LoadingSpinner from '@/components/common/LoadingSpinner';
// Authentication and Protected Routes
import { useAuthStore } from '@/stores/authStore';

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

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className='flex'>
          {/* Add Navigation at the top */}
          <Navigation />

          {/* Conditionally render Sidebar content only when authenticated */}
          <Sidebar />

          <main className={`flex-grow p-8 ${isAuthenticated ? 'ml-64' : ''} mt-16`}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path='/' element={<HomePage />} />
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
                      <SettingsPage />
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
                    <ProtectedRoute requiredRole='any'>
                      <AdminPromotionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/admin/dashboard'
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path='/insights' element={<InsightsPage />} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
        <Toaster position='top-right' />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
