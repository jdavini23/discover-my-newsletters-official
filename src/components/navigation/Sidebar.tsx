import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { useNavigation } from '@/contexts/NavigationContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { getCurrentSectionItems } = useNavigation();

  // Determine user role, default to 'user'
  const userRole = user?.role || 'user';

  // Get main navigation items for the current user role
  const mainNavItems = getCurrentSectionItems(userRole, 'main');
  const secondaryNavItems = getCurrentSectionItems(userRole, 'secondary');
  const adminNavItems = getCurrentSectionItems(userRole, 'admin');

  // Check if a navigation item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-dark-background border-r border-gray-200 dark:border-dark-border overflow-y-auto transition-transform duration-300 ease-in-out`}
    >
      <nav className='p-4'>
        {/* Main Navigation Section */}
        {mainNavItems.length > 0 && (
          <div className='mb-4'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase mb-2'>
              Main
            </h3>
            <ul className='space-y-2'>
              {mainNavItems.map((item) => (
                <li key={item.path}>
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
          </div>
        )}

        {/* Admin Navigation Section */}
        {adminNavItems.length > 0 && (
          <div className='mb-4'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase mb-2'>
              Admin
            </h3>
            <ul className='space-y-2'>
              {adminNavItems.map((item) => (
                <li key={item.path}>
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
          </div>
        )}

        {/* Secondary Navigation Section */}
        {secondaryNavItems.length > 0 && (
          <div className='border-t pt-4'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase mb-2'>
              Settings
            </h3>
            <ul className='space-y-2'>
              {secondaryNavItems.map((item) => (
                <li key={item.path}>
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
          </div>
        )}
      </nav>
    </aside>
  );
};
