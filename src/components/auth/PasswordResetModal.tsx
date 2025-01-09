import { MailIcon } from 'lucide-react';
import { LockIcon } from 'lucide-react';
import React, { useState } from 'react';

import { motion } from '@/lib/framer-motion';
import { toast } from '@/lib/react-hot-toast';
import { AuthService } from '@/services/authService';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetStage, setResetStage] = useState<'email' | 'code' | 'newPassword'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AuthService.sendPasswordResetCode(email);
      toast.success('Reset code sent to your email');
      setResetStage('code');
    } catch (error) {
      toast.error('Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isValid = await AuthService.verifyPasswordResetCode(email, resetCode);
      if (isValid) {
        setResetStage('newPassword');
      } else {
        toast.error('Invalid reset code');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(resetCode, newPassword);
      toast.success('Password reset successfully');
      onClose();
    } catch (error) {
      toast.error('Password reset failed');
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
        className='bg-white rounded-2xl p-8 max-w-md w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-center mb-6'>
          <LockIcon className='mx-auto h-12 w-12 text-primary-600 mb-4' />
          <h2 className='text-2xl font-bold'>
            {resetStage === 'email' && 'Reset Your Password'}
            {resetStage === 'code' && 'Enter Reset Code'}
            {resetStage === 'newPassword' && 'Create New Password'}
          </h2>
        </div>

        {resetStage === 'email' && (
          <form onSubmit={handleSendResetCode}>
            <div className='mb-4'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MailIcon className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                  placeholder='Enter your email'
                />
              </div>
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {resetStage === 'code' && (
          <form onSubmit={handleVerifyResetCode}>
            <div className='mb-4'>
              <label htmlFor='resetCode' className='block text-sm font-medium text-gray-700 mb-2'>
                Reset Code
              </label>
              <input
                type='text'
                id='resetCode'
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter 6-digit reset code'
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {resetStage === 'newPassword' && (
          <form onSubmit={handleResetPassword}>
            <div className='mb-4'>
              <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                New Password
              </label>
              <input
                type='password'
                id='newPassword'
                autoComplete='new-password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter new password'
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Confirm New Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Confirm new password'
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};
