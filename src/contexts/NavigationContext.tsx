import {
  Briefcase as BriefcaseIcon,
  Home as HomeIcon,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
} from 'lucide-react';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define navigation item type
export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType;
  roles: string[]; // Roles that can access this item
  section: 'main' | 'secondary' | 'admin';
  requiredPermissions?: string[]; // Additional permission checks
}

// Navigation configuration
export const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    roles: ['user', 'admin'],
    section: 'main',
  },
  {
    name: 'Newsletters',
    path: '/newsletters',
    icon: InboxIcon,
    roles: ['user', 'admin'],
    section: 'main',
  },
  {
    name: 'Recommendations',
    path: '/recommendations',
    icon: BriefcaseIcon,
    roles: ['user', 'admin'],
    section: 'main',
  },
  {
    name: 'User Management',
    path: '/admin/users',
    icon: UsersIcon,
    roles: ['admin'],
    section: 'admin',
    requiredPermissions: ['user_management'],
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    roles: ['user', 'admin'],
    section: 'secondary',
  },
];

// Navigation context interface
interface NavigationContextType {
  navItems: NavigationItem[];
  setNavItems: React.Dispatch<React.SetStateAction<NavigationItem[]>>;
  filterNavItemsByRole: (userRole: string) => NavigationItem[];
  getCurrentSectionItems: (
    userRole: string,
    section: 'main' | 'secondary' | 'admin'
  ) => NavigationItem[];
}

// Create context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Navigation context provider
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(DEFAULT_NAV_ITEMS);

  // Filter navigation items by user role
  const filterNavItemsByRole = (userRole: string) => {
    return navItems.filter((item) => item.roles.includes(userRole));
  };

  // Get navigation items for a specific section and role
  const getCurrentSectionItems = (userRole: string, section: 'main' | 'secondary' | 'admin') => {
    return navItems.filter((item) => item.section === section && item.roles.includes(userRole));
  };

  const contextValue = {
    navItems,
    setNavItems,
    filterNavItemsByRole,
    getCurrentSectionItems,
  };

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
};

// Custom hook to use navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
