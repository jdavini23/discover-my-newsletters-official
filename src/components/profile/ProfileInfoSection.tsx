import React, { useState } from 'react';

import { useUserProfileStore } from '@/stores/userProfileStore';

import { UserProfile } from '../../types/profile';

const DEFAULT_AVATAR = '/src/assets/images/default-avatar.svg';

interface ProfileInfoSectionProps {
  profile: UserProfile;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ profile }) => {
  const { updateProfile } = useUserProfileStore();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      await updateProfile({
        displayName,
        bio,
      });
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  if (!profile) return null;

  return (
    <div className='bg-neutralBackground-100 shadow-soft rounded-xl p-4 sm:p-6'>
      <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-neutralText-500'>
        Profile Information
      </h2>

      <div className='flex flex-col sm:flex-row items-center mb-4 sm:mb-6'>
        <img
          alt='Profile'
          className='w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6 border-4 border-primary-100'
          src={profile.photoURL || DEFAULT_AVATAR}
        />
        <div className='text-center sm:text-left'>
          <p className='text-sm sm:text-base text-neutralText-500'>{profile.email}</p>
        </div>
      </div>

      <div className='space-y-3 sm:space-y-4'>
        <div>
          <label
            htmlFor='displayName'
            className='block text-xs sm:text-sm font-medium text-neutralText-700'
          >
            Display Name
          </label>
          <input
            type='text'
            id='displayName'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className='mt-1 block w-full rounded-md border-neutralBackground-500 shadow-soft focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 text-sm sm:text-base py-2 sm:py-3'
          />
        </div>

        <div>
          <label
            htmlFor='bio'
            className='block text-xs sm:text-sm font-medium text-neutralText-700'
          >
            Bio
          </label>
          <textarea
            id='bio'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className='mt-1 block w-full rounded-md border-neutralBackground-500 shadow-soft focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 text-sm sm:text-base py-2 sm:py-3'
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className='w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base'
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoSection;
