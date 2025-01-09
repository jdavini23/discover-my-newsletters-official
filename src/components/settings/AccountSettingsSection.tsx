import React from 'react';

import { useAuthStore } from '@/stores/authStore';

const AccountSettingsSection: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Account Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Display Name
          </label>
          <input
            type='text'
            value={user?.displayName || ''}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-surface dark:border-dark-border'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Email Address
          </label>
          <input
            type='email'
            value={user?.email || ''}
            readOnly
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-dark-background dark:border-dark-border'
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSection;
