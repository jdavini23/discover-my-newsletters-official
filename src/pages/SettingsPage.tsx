import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
// Lucide icons
import { Bell, Lock, LogOut, Palette, Settings as SettingsIcon, Shield, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// Settings Page Sections
import AccountSettingsSection from '@/components/settings/AccountSettingsSection';
import AppearanceSection from '@/components/settings/AppearanceSection';
import NotificationPreferencesSection from '@/components/settings/NotificationPreferencesSection';
import SecuritySection from '@/components/settings/SecuritySection';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

const SETTINGS_SECTIONS = [
  {
    name: 'account',
    label: 'Account Settings',
    icon: User,
    component: AccountSettingsSection,
  },
  {
    name: 'notifications',
    label: 'Notifications',
    icon: Bell,
    component: NotificationPreferencesSection,
  },
  {
    name: 'appearance',
    label: 'Appearance',
    icon: Palette,
    component: AppearanceSection,
  },
  {
    name: 'security',
    label: 'Security',
    icon: Shield,
    component: SecuritySection,
  },
];

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('account');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect unauthenticated users
    if (!user) {
      // navigate('/auth');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveSection = () => {
    const ActiveComponent = SETTINGS_SECTIONS.find(
      (section) => section.name === activeSection
    )?.component;

    return ActiveComponent ? <ActiveComponent /> : null;
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-dark-background'>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleMobileSidebar}
        className='fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-dark-surface p-2 rounded-full shadow-md'
      >
        {isMobileSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 z-40 md:hidden'
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{
          x: isMobileSidebarOpen ? 0 : '-100%',
          display: isMobileSidebarOpen ? 'block' : 'none',
        }}
        transition={{ type: 'tween' }}
        className='fixed top-0 left-0 w-64 h-full bg-white dark:bg-dark-surface shadow-lg z-50 
                   md:relative md:block md:w-64 md:translate-x-0'
      >
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-6 flex items-center'>
            <SettingsIcon className='mr-2 text-primary-500' /> Settings
          </h2>
          <nav className='space-y-2'>
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section.name}
                onClick={() => {
                  setActiveSection(section.name);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-md transition ${
                  activeSection === section.name
                    ? 'bg-primary-100 dark:bg-dark-border text-primary-600'
                    : 'hover:bg-gray-100 dark:hover:bg-dark-border'
                }`}
              >
                <section.icon className='mr-3' size={20} />
                {section.label}
              </button>
            ))}
            <button
              className='w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center justify-center'
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                'Logging out...'
              ) : (
                <>
                  <LogOut className='mr-2' /> Logout
                </>
              )}
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className='flex-grow p-6 md:p-12 overflow-y-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='max-w-4xl mx-auto'
        >
          {renderActiveSection()}
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
