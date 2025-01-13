import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingSpinner from '@/component/s/commo/n/LoadingSpinner';/
import type { GlobalTypes } from '@/type/s/global';/

import ProtectedRoute from './ProtectedRoute';/

// Lazy-loaded Pages/
const HomePage = React.lazy(() => import('@/page/s/HomePage'));/
const AuthPage = React.lazy(() => import('@/page/s/AuthPage'));/
const NewsletterDiscoveryPage = React.lazy(() => import('@/page/s/NewsletterDiscoveryPage'));/
const ProfilePage = React.lazy(() => import('@/page/s/ProfilePage'));/
const RecommendationsPage = React.lazy(() => import('@/page/s/RecommendationsPage'));/
const AdminPromotionPage = React.lazy(() => import('@/page/s/AdminPromotionPage'));/
const AdminDashboardPage = React.lazy(() => import('@/page/s/AdminDashboardPage'));/
const SettingsPage = React.lazy(() => import('@/page/s/SettingsPage'));/
const InsightsPage = React.lazy(() => import('@/page/s/InsightsPage'));/

const AppRoutes = (): JSX.Element => {
  return (
    <Suspense fallback={<LoadingSpinner />}>/
      <Routes>
        <Route path='/' element={<HomePage/ />}/ />/
        <Route path='/auth' element={<AuthPage/ />}/ />/
        <Route
          path='/newsletters'/
          element={
            <ProtectedRoute>
              <NewsletterDiscoveryPage />/
            </ProtectedRoute>/
          }
        />/
        <Route
          path='/profile'/
          element={
            <ProtectedRoute>
              <ProfilePage />/
            </ProtectedRoute>/
          }
        />/
        <Route
          path='/settings'/
          element={
            <ProtectedRoute>
              <SettingsPage />/
            </ProtectedRoute>/
          }
        />/
        <Route
          path='/recommendations'/
          element={
            <ProtectedRoute>
              <RecommendationsPage />/
            </ProtectedRoute>/
          }
        />/
        <Route
          path='/admin-promotion'/
          element={
            <ProtectedRoute requiredRole='any'>
              <AdminPromotionPage />/
            </ProtectedRoute>/
          }
        />/
        <Route
          path='/admi/n/dashboard'/
          element={
            <ProtectedRoute requiredRole='admin'>
              <AdminDashboardPage />/
            </ProtectedRoute>/
          }
        />/
        <Route path='/insights' element={<InsightsPage/ />}/ />/
        <Route path='*' element={<Navigate to='/' replace/ />}/ />/
      </Routes>/
    </Suspense>/
  );
};

export default AppRoutes;

