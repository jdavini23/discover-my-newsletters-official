import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ChartBarIcon, 
  CogIcon, 
  StarIcon 
} from '@heroicons/react/24/outline';

import { useAuthStore } from '@/stores/authStore';

const NAV_ITEMS = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: HomeIcon,
    requiredRole: 'user'
  },
  { 
    name: 'Discover', 
    path: '/discover', 
    icon: MagnifyingGlassIcon,
    requiredRole: 'user'
  },
  { 
    name: 'Recommendations', 
    path: '/recommendations', 
    icon: StarIcon,
    requiredRole: 'user'
  },
  { 
    name: 'Admin Promotion', 
    path: '/admin-promotion', 
    icon: StarIcon,
    requiredRole: 'user'
  },
  { 
    name: 'Insights', 
    path: '/insights', 
    icon: ChartBarIcon,
    requiredRole: 'admin'
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: CogIcon,
    requiredRole: 'user'
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const filteredNavItems = NAV_ITEMS.filter(item => {
    // Always show items for users, filter admin items based on role
    if (item.requiredRole === 'user') return true;
    return user?.role === 'admin';
  });

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-600">
            Newsletter Discovery
          </h1>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-lg transition-all duration-200
                    ${isActive(item.path) 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Optional: User profile section */}
        {user && (
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center">
              <img 
                src={user.photoURL || '/default-avatar.png'} 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
