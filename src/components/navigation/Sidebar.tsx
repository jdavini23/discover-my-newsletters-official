import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, Search, BarChart, Settings, Star } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/newsletters',
    icon: HomeIcon,
    requiredRole: 'user',
    uniqueKey: 'dashboard-newsletters',
  },
  {
    name: 'Discover',
    path: '/newsletters',
    icon: Search,
    requiredRole: 'user',
    uniqueKey: 'discover-newsletters',
  },
  {
    name: 'Recommendations',
    path: '/recommendations',
    icon: Star,
    requiredRole: 'user',
    uniqueKey: 'recommendations',
  },
  {
    name: 'Admin Promotion',
    path: '/admin-promotion',
    icon: BarChart,
    requiredRole: 'user',
    uniqueKey: 'admin-promotion',
  },
  {
    name: 'Insights',
    path: '/insights',
    icon: BarChart,
    requiredRole: 'admin',
    uniqueKey: 'insights',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    requiredRole: 'user',
    uniqueKey: 'settings',
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    // Always show items for users, filter admin items based on role
    if (item.requiredRole === 'user') return true;
    return user?.role === 'admin';
  });

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-dark-background border-r border-gray-200 dark:border-dark-border overflow-y-auto transition-transform duration-300 ease-in-out`}
    >
      <nav className='p-4'>
        <ul className='space-y-2'>
          {filteredNavItems.map((item) => (
            <li key={item.uniqueKey}>
              <Link
                to={item.path}
                className={`
                  flex items-center p-3 rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className='w-6 h-6 mr-3' />
                <span className='font-medium'>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
