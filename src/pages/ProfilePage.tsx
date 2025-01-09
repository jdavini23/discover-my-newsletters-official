import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import useUserProfileStore from '@/stores/userProfileStore';
import { useAuthStore } from '@/stores/authStore';
import { AdminInviteService } from '@/services/adminInviteService';
import { AdminInviteManager } from '@/components/admin/AdminInviteManager';

// Profile Page Sections
import ProfileInfoSection from '@/components/profile/ProfileInfoSection';
import PreferencesSection from '@/components/profile/PreferencesSection';
import AccountSettingsSection from '@/components/profile/AccountSettingsSection';
import InteractionInsightsSection from '@/components/profile/InteractionInsightsSection';

// Lucide icons
import { User, Star, Settings, BarChart, Shield } from 'lucide-react';

const PROFILE_SECTIONS = [
  {
    name: 'info',
    label: 'Profile Info',
    icon: User,
    component: ProfileInfoSection,
  },
  {
    name: 'preferences',
    label: 'Preferences',
    icon: Star,
    component: PreferencesSection,
  },
  {
    name: 'settings',
    label: 'Account Settings',
    icon: Settings,
    component: AccountSettingsSection,
  },
  {
    name: 'insights',
    label: 'Interaction Insights',
    icon: BarChart,
    component: InteractionInsightsSection,
  },
  // Add admin section only for admins
  {
    name: 'admin',
    label: 'Admin Tools',
    icon: Shield,
    component: AdminInviteManager,
    adminOnly: true,
  },
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { profile, fetchProfile, isLoading, error } = useUserProfileStore();
  const [activeSection, setActiveSection] = useState<
    'info' | 'preferences' | 'settings' | 'insights' | 'admin'
  >('info');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // New state for admin promotion modal
  const [isAdminPromotionModalOpen, setIsAdminPromotionModalOpen] = useState(false);
  const [adminInviteCode, setAdminInviteCode] = useState('');

  // Handler for admin promotion
  const handleAdminPromotion = async () => {
    try {
      const result = await AdminInviteService.validateAdminInviteCode(
        user?.uid || '', 
        adminInviteCode
      );

      if (result) {
        toast.success('Successfully promoted to admin!', {
          icon: '🚀',
          duration: 4000,
        });
        // Optionally refresh user data or trigger a re-authentication
        setIsAdminPromotionModalOpen(false);
        
        // Optional: Trigger a user refresh or re-authentication
        // This depends on your authentication flow
      } else {
        toast.error('Invalid or expired invite code', {
          icon: '❌',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Admin promotion error:', error);
      toast.error('Failed to promote to admin', {
        icon: '⚠️',
        duration: 3000,
      });
    }
  };

  // Optional: Function to generate an admin invite code (for admins)
  const generateAdminInviteCode = async () => {
    try {
      // Only allow existing admins to generate invite codes
      if (user?.role !== 'admin') {
        toast.error('Only admins can generate invite codes');
        return;
      }

      const newInviteCode = await AdminInviteService.generateAdminInviteCode(
        user.uid, 
        {
          maxUses: 3, // Limit to 3 uses
          expiryDays: 14, // Expires in 14 days
          // Only include notes if user has a display name
          ...(user.displayName && { 
            notes: `Generated by ${user.displayName}`
          })
        }
      );

      // Copy to clipboard and show toast
      navigator.clipboard.writeText(newInviteCode);
      toast.success(`Invite Code Generated: ${newInviteCode}`, {
        icon: '🔑',
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to generate invite code:', error);
      toast.error('Could not generate invite code');
    }
  };

  // Type guard to ensure type safety
  const isValidSection = (
    section: string
  ): section is 'info' | 'preferences' | 'settings' | 'insights' | 'admin' => {
    return ['info', 'preferences', 'settings', 'insights', 'admin'].includes(section);
  };

  useEffect(() => {
    console.log('ProfilePage useEffect triggered', {
      user,
      userUid: user?.id,
      isAuthenticated,
      profile,
      isLoading,
      error,
    });

    // Comprehensive authentication check
    if (!isAuthenticated) {
      console.warn('Not authenticated, redirecting to auth');
      navigate('/auth');
      return;
    }

    // Ensure user exists before fetching profile
    if (user?.uid) {
      console.log('Attempting to fetch profile for user:', user.uid);
      fetchProfile(user.uid).catch((err) => {
        console.error('Profile fetch failed:', err);
        // Optional: Handle profile fetch failure
      });
    } else {
      console.warn('No user ID available');
      // Optionally, you might want to trigger a re-authentication or show an error
      navigate('/auth');
    }
  }, [user, isAuthenticated, fetchProfile, navigate]);

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
            // Only show admin section to admins
            (!section.adminOnly || user?.role === 'admin') && (
              <button
                key={section.name}
                className={`w-full text-left p-2 flex items-center ${
                  activeSection === section.name ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (isValidSection(section.name)) {
                    setActiveSection(section.name);
                  }
                }}
              >
                <section.icon className='mr-2' size={16} />
                {section.label}
              </button>
            )
          ))}
          
          {/* Conditionally render admin promotion only for non-admin users */}
          {user && user.role !== 'admin' && (
            <div className='mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r'>
              <h3 className='text-sm font-semibold text-yellow-700'>Become an Admin</h3>
              <p className='text-xs text-yellow-600 mb-2'>
                Unlock advanced features and help manage the platform
              </p>
              <button 
                className='w-full bg-yellow-500 text-white py-1 rounded text-xs hover:bg-yellow-600 transition-colors'
                onClick={() => setIsAdminPromotionModalOpen(true)}
              >
                Apply for Admin
              </button>
            </div>
          )}
          {user && user.role === 'admin' && (
            <div className='mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r'>
              <h3 className='text-sm font-semibold text-green-700'>Generate Admin Invite Code</h3>
              <p className='text-xs text-green-600 mb-2'>
                Generate a code to invite others to become admins
              </p>
              <button 
                className='w-full bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600 transition-colors'
                onClick={generateAdminInviteCode}
              >
                Generate Code
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className='w-3/4'>
        {PROFILE_SECTIONS.map(
          (section) =>
            activeSection === section.name && 
            (!section.adminOnly || user?.role === 'admin') && (
              <section.component key={section.name} profile={profile} />
            )
        )}
      </div>

      {/* Admin Promotion Modal */}
      <AnimatePresence>
        {isAdminPromotionModalOpen && (
          <motion.div 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-white p-6 rounded-lg shadow-xl w-96'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className='text-xl font-bold mb-4'>Admin Promotion</h2>
              <p className='text-sm text-gray-600 mb-4'>
                Enter your admin invite code to get promoted to an admin role.
              </p>
              <input 
                type='text'
                value={adminInviteCode}
                onChange={(e) => setAdminInviteCode(e.target.value)}
                placeholder='Enter invite code'
                className='w-full p-2 border rounded mb-4'
              />
              <div className='flex justify-between'>
                <button 
                  onClick={() => setIsAdminPromotionModalOpen(false)}
                  className='px-4 py-2 bg-gray-200 text-gray-800 rounded'
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdminPromotion}
                  className='px-4 py-2 bg-green-500 text-white rounded'
                >
                  Promote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
