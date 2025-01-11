import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { GlobalTypes } from '@/types/global';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const NewsletterDiscoveryPage = React.lazy(() => import('@/pages/NewsletterDiscoveryPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const RecommendationsPage = React.lazy(() => import('@/pages/RecommendationsPage'));
const AdminPromotionPage = React.lazy(() => import('@/pages/AdminPromotionPage'));
const AdminDashboardPage = React.lazy(() => import('@/pages/AdminDashboardPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const InsightsPage = React.lazy(() => import('@/pages/InsightsPage'));

const AppRoutes = (): JSX.Element => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path='/' element={<HomePage />}/>
                <Route path='/auth' element={<AuthPage />}/>
                <Route path='/newsletters' element={<ProtectedRoute>
                    <NewsletterDiscoveryPage />
                </ProtectedRoute>}/>
                <Route path='/profile' element={<ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>}/>
                <Route path='/settings' element={<ProtectedRoute>
                    <SettingsPage />
                </ProtectedRoute>}/>
                <Route path='/recommendations' element={<ProtectedRoute>
                    <RecommendationsPage />
                </ProtectedRoute>}/>
                <Route path='/admin-promotion' element={<ProtectedRoute requiredRole='any'>
                    <AdminPromotionPage />
                </ProtectedRoute>}/>
                <Route path='/admin/dashboard' element={<ProtectedRoute requiredRole='admin'>
                    <AdminDashboardPage />
                </ProtectedRoute>}/>
                <Route path='/insights' element={<InsightsPage />}/>
                <Route path='*' element={<Navigate to='/' replace/>}/>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
