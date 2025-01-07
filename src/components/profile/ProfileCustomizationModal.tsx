import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import AuthService from '../../services/authService';

import {
  UserIcon,
  EnvelopeIcon,
  CameraIcon,
  StarIcon,
  SunIcon,
  MoonIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const NEWSLETTER_CATEGORIES = [
  'Technology',
  'Science',
  'Business',
  'Design',
  'Health',
  'Finance',
  'Environment',
  'AI',
  'Startups',
  'Innovation',
];

const NEWSLETTER_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

interface ProfileCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileCustomizationModal: React.FC<ProfileCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newsletterFrequency, setNewsletterFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');

      // Check current theme preference
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    }
  }, [user]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!displayName) {
        toast.error('Display name cannot be empty');
        setIsLoading(false);
        return;
      }

      // Prepare update payload
      const updatePayload = {
        displayName,
        email,
        newsletterPreferences: {
          categories: selectedCategories,
          frequency: newsletterFrequency,
          darkMode: isDarkMode,
        },
      };

      // Attempt to update profile
      await AuthService.updateProfile(updatePayload);

      // Handle profile image upload if exists
      if (profileImage) {
        const formData = new FormData();
        formData.append('profileImage', profileImage);

        try {
          await AuthService.uploadProfileImage(formData);
        } catch (imageUploadError: Error) {
          console.error('Image upload failed', imageUploadError);
          // Non-blocking error for image upload
        }
      }

      // Close modal and refresh profile
      onClose();
    } catch (error: unknown) {
      console.error('Profile update error:', error);

      // Specific error handling
      if (error instanceof Error && error.message === 'Unauthorized') {
        toast.error('Your session has expired. Please log in again.');
        // Optional: Trigger logout or redirect to login
        AuthService.signOut();
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className='bg-white dark:bg-dark-surface rounded-2xl p-8 max-w-2xl w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-center mb-6'>
          <UserIcon className='mx-auto h-12 w-12 text-primary-600 mb-4' />
          <h2 className='text-2xl font-bold'>Customize Your Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Profile Image Upload */}
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : user?.photoURL || '/default-avatar.png'
                }
                alt='Profile'
                className='w-24 h-24 rounded-full object-cover'
              />
              <label
                htmlFor='profileImage'
                className='absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer'
              >
                <CameraIcon className='h-5 w-5' />
                <input
                  type='file'
                  id='profileImage'
                  accept='image/*'
                  className='hidden'
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
          </div>

          {/* Personal Details */}
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='displayName' className='block text-sm font-medium text-gray-700 mb-2'>
                Display Name
              </label>
              <div className='relative'>
                <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  type='text'
                  id='displayName'
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className='pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                  placeholder='Enter your name'
                />
              </div>
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <div className='relative'>
                <EnvelopeIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  type='email'
                  id='email'
                  value={email}
                  readOnly
                  className='pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100'
                />
              </div>
            </div>
          </div>

          {/* Newsletter Preferences */}
          <div>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <StarIcon className='h-6 w-6 mr-2 text-yellow-500 dark:text-yellow-300' />
              Newsletter Interests
            </h3>
            <div className='flex flex-wrap gap-2'>
              {NEWSLETTER_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type='button'
                  onClick={() => handleCategoryToggle(category)}
                  className={`
                    px-3 py-1 rounded-full text-sm transition
                    ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Frequency */}
          <div className='mb-6'>
            <label
              htmlFor='newsletter-frequency'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Newsletter Frequency
            </label>
            <select
              id='newsletter-frequency'
              value={newsletterFrequency}
              onChange={(e) =>
                setNewsletterFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')
              }
              className='
                w-full 
                px-3 
                py-2 
                border 
                border-gray-300 
                dark:border-gray-600 
                rounded-md 
                shadow-sm 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2 
                focus:ring-primary-500 
                dark:bg-dark-surface 
                dark:text-white
              '
            >
              {NEWSLETTER_FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          {/* Settings Section */}
          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <CogIcon className='h-6 w-6 mr-2 text-gray-600 dark:text-gray-300' />
              User Settings
            </h3>

            {/* Dark Mode Toggle */}
            <div className='flex items-center justify-between bg-gray-100 dark:bg-dark-background p-4 rounded-lg mb-4'>
              <div className='flex items-center'>
                {isDarkMode ? (
                  <MoonIcon className='h-6 w-6 mr-3 text-indigo-600' />
                ) : (
                  <SunIcon className='h-6 w-6 mr-3 text-yellow-500' />
                )}
                <div>
                  <span className='text-sm font-medium block'>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    Customize your app's appearance
                  </span>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className='
                  relative 
                  inline-flex 
                  h-6 
                  w-11 
                  flex-shrink-0 
                  cursor-pointer 
                  rounded-full 
                  border-2 
                  border-transparent 
                  transition-colors 
                  duration-200 
                  ease-in-out 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-primary-500 
                  focus:ring-offset-2
                  bg-gray-200 
                  dark:bg-gray-700
                '
                aria-label='Toggle dark mode'
              >
                <span
                  className={`
                    ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}
                    pointer-events-none 
                    inline-block 
                    h-5 
                    w-5 
                    transform 
                    rounded-full 
                    bg-white 
                    shadow-lg 
                    ring-0 
                    transition 
                    duration-200 
                    ease-in-out
                  `}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-6'
          >
            {isLoading ? 'Updating...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
