import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import useUserProfileStore from '@/stores/userProfileStore';
import useAuthStore from '@/stores/authStore';

// Profile Page Sections
import ProfileInfoSection from '@/components/profile/ProfileInfoSection';
import PreferencesSection from '@/components/profile/PreferencesSection';
import AccountSettingsSection from '@/components/profile/AccountSettingsSection';
import InteractionInsightsSection from '@/components/profile/InteractionInsightsSection';

// Heroicons
import { UserIcon, StarIcon, CogIcon, ChartBarIcon } from '@/lib/heroicons/react/24/outline';

const PROFILE_SECTIONS = [
  {
    name: 'info',
    label: 'Profile Info',
    icon: UserIcon,
    component: ProfileInfoSection,
  },
  {
    name: 'preferences',
    label: 'Preferences',
    icon: StarIcon,
    component: PreferencesSection,
  },
  {
    name: 'settings',
    label: 'Account Settings',
    icon: CogIcon,
    component: AccountSettingsSection,
  },
  {
    name: 'insights',
    label: 'Interaction Insights',
    icon: ChartBarIcon,
    component: InteractionInsightsSection,
  },
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile, fetchProfile, isLoading, error } = useUserProfileStore();
  const [activeSection, setActiveSection] = useState<
    'info' | 'preferences' | 'settings' | 'insights'
  >('info');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.uid) {
      fetchProfile(user.uid);
    }
  }, [user, fetchProfile, navigate]);

  // Memoized loading and error states for performance
  const renderLoadingState = useMemo(() => {
    if (isLoading) {
      return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='text-center p-8 bg-white rounded-2xl shadow-lg'
          >
            <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-primary-500 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold text-gray-700'>Loading Profile</h2>
            <p className='text-gray-500'>Fetching your personalized experience</p>
          </motion.div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex justify-center items-center min-h-screen bg-red-50'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center p-8 bg-white rounded-2xl shadow-lg'
          >
            <div className='text-red-500 mb-4'>
              <svg className='mx-auto h-16 w-16' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2L2 22h20L12 2zm1 18h-2v-2h2v2zm0-4h-2V8h2v8z' />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-red-600 mb-2'>Profile Loading Error</h2>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => fetchProfile(user?.uid || '')}
              className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600'
            >
              Retry
            </button>
          </motion.div>
        </div>
      );
    }

    return null;
  }, [isLoading, error, fetchProfile, user]);

  // Early return for loading and error states
  if (renderLoadingState) return renderLoadingState;
  if (!profile) return null;

  return (
    <div className='container mx-auto px-4 py-8 flex'>
      {/* Sidebar Navigation */}
      <div className='w-1/4 pr-8'>
        <nav className='space-y-2'>
          {PROFILE_SECTIONS.map((section) => (
            <button
              key={section.name}
              className={`w-full text-left p-2 ${activeSection === section.name ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveSection(section.name)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className='w-3/4'>
        {PROFILE_SECTIONS.map(
          (section) =>
            activeSection === section.name && (
              <section.component key={section.name} profile={profile} />
            )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
