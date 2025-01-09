import React, { useState } from 'react';
import { UserProfile } from '../../types/profile';
import { auth } from '../../config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import AdminPromotionPanel from '@/components/admin/AdminPromotionPanel';

interface AccountSettingsSectionProps {
  profile: UserProfile;
}

const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({ profile: _profile }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (!auth.currentUser) {
      setError('No user is currently logged in');
      return;
    }

    try {
      // Reauthenticate the user
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmDelete) {
      try {
        // Implement account deletion logic
        // This typically involves calling a backend function or Firebase method
        await auth.currentUser?.delete();
        navigate('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete account');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  return (
    <div className='space-y-4 sm:space-y-8'>
      <div className='bg-white shadow-md rounded-lg p-4 sm:p-6'>
        <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>Account Settings</h2>

        <div className='mb-4 sm:mb-6'>
          <h3 className='text-base sm:text-lg font-semibold mb-2 sm:mb-4'>Change Password</h3>
          <div className='space-y-3 sm:space-y-4'>
            <div>
              <label htmlFor='currentPassword' className='block text-xs sm:text-sm font-medium text-gray-700'>
                Current Password
              </label>
              <input
                type='password'
                id='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-base'
              />
            </div>
            <div>
              <label htmlFor='newPassword' className='block text-xs sm:text-sm font-medium text-gray-700'>
                New Password
              </label>
              <input
                type='password'
                id='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-base'
              />
            </div>
            <div>
              <label htmlFor='confirmPassword' className='block text-xs sm:text-sm font-medium text-gray-700'>
                Confirm New Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-base'
              />
            </div>
            {error && <p className='text-red-500 text-xs sm:text-sm mt-1 sm:mt-2'>{error}</p>}
            {success && <p className='text-green-500 text-xs sm:text-sm mt-1 sm:mt-2'>{success}</p>}
            <div className='flex space-x-2 sm:space-x-4'>
              <button
                onClick={handlePasswordChange}
                className='bg-blue-500 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-md hover:bg-blue-600 text-xs sm:text-base'
              >
                Update Password
              </button>
              <button
                onClick={handleLogout}
                className='bg-gray-200 text-gray-800 py-1 sm:py-2 px-2 sm:px-4 rounded-md hover:bg-gray-300 text-xs sm:text-base'
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className='border-t pt-4 sm:pt-6'>
          <h3 className='text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-red-600'>Danger Zone</h3>
          <button
            onClick={handleDeleteAccount}
            className='bg-red-500 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-md hover:bg-red-600 text-xs sm:text-base'
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Add AdminPromotionPanel only for non-admin users */}
      {user?.role !== 'admin' && (
        <div className='bg-white shadow-md rounded-lg p-4 sm:p-6'>
          <AdminPromotionPanel />
        </div>
      )}
    </div>
  );
};

export default AccountSettingsSection;
