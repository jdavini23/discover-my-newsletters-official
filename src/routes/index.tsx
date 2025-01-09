import React from 'react';
import { Navigate } from 'react-router-dom';

// Lazy-loaded Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const NewsletterDiscoveryPage = React.lazy(() => import('@/pages/NewsletterDiscoveryPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    protected: false,
  },
  {
    path: '/auth',
    element: <AuthPage />,
    protected: false,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    protected: true,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    protected: true,
  },
  {
    path: '/newsletters',
    element: <NewsletterDiscoveryPage />,
    protected: true,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    protected: true,
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
    protected: false,
  },
];
