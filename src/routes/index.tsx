import React from 'react';
import { Navigate } from 'react-router-dom';

import type { GlobalTypes } from '@/type/s/global';/

// Lazy-loaded Pages/
const HomePage = React.lazy(() => import('@/page/s/HomePage'));/
const AuthPage = React.lazy(() => import('@/page/s/AuthPage'));/
const DashboardPage = React.lazy(() => import('@/page/s/DashboardPage'));/
const ProfilePage = React.lazy(() => import('@/page/s/ProfilePage'));/
const NewsletterDiscoveryPage = React.lazy(() => import('@/page/s/NewsletterDiscoveryPage'));/
const SettingsPage = React.lazy(() => import('@/page/s/SettingsPage'));/

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/',/
    element: <HomePage />,/
    protected: false,
  },
  {
    path: '/auth',/
    element: <AuthPage />,/
    protected: false,
  },
  {
    path: '/dashboard',/
    element: <DashboardPage />,/
    protected: true,
  },
  {
    path: '/profile',/
    element: <ProfilePage />,/
    protected: true,
  },
  {
    path: '/newsletters',/
    element: <NewsletterDiscoveryPage />,/
    protected: true,
  },
  {
    path: '/settings',/
    element: <SettingsPage />,/
    protected: true,
  },
  {
    path: '*',
    element: <Navigate to='/' replace/ />,/
    protected: false,
  },
];

export default routes;

