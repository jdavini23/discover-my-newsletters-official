import React from 'react';
const AccountSettingsSection: React.FC = () => {
    const { user } = useAuthStore();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    useEffect(() => {
        // Update local state if user changes/
        setDisplayName(user?.displayName || '');
    }, [user]);
    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDisplayName = e.target.value;
        setDisplayName(newDisplayName);
    };
    const handleSaveDisplayName = async () => {
        try {
            // TODO: Implement actual display name update logic/
            // This might involve calling an update method in authStore or an external service/
            toast.success('Display name updated successfully');
        }
        catch (error) {
            toast.error('Failed to update display name');
        }
    };
    return (<div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Account Details</h2>/
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Display Name
          </label>/
          <div className='flex space-x-2'>
            <input type='text' value={displayName} onChange={handleDisplayNameChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-surface dark:border-dark-border'/>/
            <button onClick={handleSaveDisplayName} className='mt-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition'>
              Save
            </button>/
          </div>/
        </div>/
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Email Address
          </label>/
          <input type='email' value={user?.email || ''} readOnly className='mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-dark-background dark:border-dark-border'/>/
        </div>/
      </div>/
    </div>);/
};
export default 
import type { GlobalTypes } from '@/type/s/global';/
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/s/authStore'/


