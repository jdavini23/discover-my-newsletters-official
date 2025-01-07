import React, { useState } from 'react';
import { UserProfile } from '../../types/profile';
import { auth } from '../../config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface AccountSettingsSectionProps {
  profile: UserProfile;
}

const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({ profile: _profile }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
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
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-6'>Account Settings</h2>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>Change Password</h3>
        <div className='space-y-4'>
          <div>
            <label htmlFor='currentPassword' className='block text-sm font-medium text-gray-700'>
              Current Password
            </label>
            <input
              type='password'
              id='currentPassword'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3'
            />
          </div>
          <div>
            <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3'
            />
          </div>
          <div>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3'
            />
          </div>
          {error && <p className='text-sm text-red-600 mt-2'>{error}</p>}
          {success && <p className='text-sm text-green-600 mt-2'>{success}</p>}
          <button
            onClick={handlePasswordChange}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Change Password
          </button>
        </div>
      </div>

      <div className='border-t pt-6 mt-6'>
        <h3 className='text-lg font-semibold mb-4'>Session Management</h3>
        <div className='bg-gray-50 border border-gray-200 p-4 rounded-md'>
          <p className='text-sm text-gray-700 mb-4'>Log out of your account on this device.</p>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50'
          >
            Logout
          </button>
        </div>
      </div>

      <div className='border-t pt-6 mt-6'>
        <h3 className='text-lg font-semibold mb-4 text-red-600'>Danger Zone</h3>
        <div className='bg-red-50 border border-red-200 p-4 rounded-md'>
          <p className='text-sm text-red-700 mb-4'>
            Deleting your account will permanently remove all your data. This action cannot be
            undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSection;
