import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/lib/react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import NewsletterDiscoveryPage from '@/pages/NewsletterDiscoveryPage';
import ProfilePage from '@/pages/ProfilePage';
import NewsletterDetailPage from '@/pages/NewsletterDetailPage';
import Layout from '@/components/layout/Layout';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path='/auth'
            element={!isAuthenticated ? <AuthPage /> : <Navigate to='/newsletters' replace />}
          />
          <Route
            path='/newsletters'
            element={
              isAuthenticated ? <NewsletterDiscoveryPage /> : <Navigate to='/auth' replace />
            }
          />
          <Route
            path='/newsletters/:newsletterId'
            element={isAuthenticated ? <NewsletterDetailPage /> : <Navigate to='/auth' replace />}
          />
          <Route
            path='/profile'
            element={isAuthenticated ? <ProfilePage /> : <Navigate to='/auth' replace />}
          />
          <Route path='/' element={<HomePage />} />
          {/* Catch-all route to handle undefined routes */}
          <Route
            path='*'
            element={<Navigate to={isAuthenticated ? '/newsletters' : '/auth'} replace />}
          />
        </Routes>
        <Toaster position='top-right' />
      </Layout>
    </Router>
  );
}

export default App;
