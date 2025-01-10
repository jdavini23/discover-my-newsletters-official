import { MailIcon } from 'lucide-react';
import { LockIcon } from 'lucide-react';
import React, { useState } from 'react';

import { toast } from '@/lib/react-hot-toast';
import { AuthService } from '@/services/authService';

interface PasswordResetModalProps {
  email?: string;
  onClose: () => void;
  onResetComplete?: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  email: initialEmail = '',
  onClose,
  onResetComplete,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [resetStage, setResetStage] = useState<'email' | 'code' | 'newPassword'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(true);

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
      const isValid = await AuthService.sendPasswordResetCode(email, resetCode);
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
      await AuthService.resetPassword(email, resetCode, newPassword);
      toast.success('Password reset successfully');
      setIsVisible(false);
      setTimeout(onResetComplete || onClose, 300);
    } catch (error) {
      toast.error('Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed 
        inset-0 
        z-50 
        flex 
        items-center 
        justify-center 
        bg-black 
        bg-opacity-50 
        transition-opacity 
        duration-300 
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          bg-white 
          rounded-2xl 
          p-8 
          max-w-md 
          w-full 
          transition-all 
          duration-300 
          transform 
          ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}
        `}
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
                  placeholder='Enter your email'
                  className='
                    block 
                    w-full 
                    pl-10 
                    pr-3 
                    py-2 
                    border 
                    border-gray-300 
                    rounded-md 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-primary-500 
                    focus:border-primary-500 
                    sm:text-sm
                  '
                />
              </div>
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className={`
                w-full 
                btn-primary 
                py-2 
                rounded-md 
                transition-colors 
                duration-300 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'}
              `}
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
                placeholder='Enter 6-digit reset code'
                className='
                  block 
                  w-full 
                  px-3 
                  py-2 
                  border 
                  border-gray-300 
                  rounded-md 
                  shadow-sm 
                  focus:outline-none 
                  focus:ring-primary-500 
                  focus:border-primary-500 
                  sm:text-sm
                '
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className={`
                w-full 
                btn-primary 
                py-2 
                rounded-md 
                transition-colors 
                duration-300 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'}
              `}
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder='Enter new password'
                className='
                  block 
                  w-full 
                  px-3 
                  py-2 
                  border 
                  border-gray-300 
                  rounded-md 
                  shadow-sm 
                  focus:outline-none 
                  focus:ring-primary-500 
                  focus:border-primary-500 
                  sm:text-sm
                '
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder='Confirm new password'
                className='
                  block 
                  w-full 
                  px-3 
                  py-2 
                  border 
                  border-gray-300 
                  rounded-md 
                  shadow-sm 
                  focus:outline-none 
                  focus:ring-primary-500 
                  focus:border-primary-500 
                  sm:text-sm
                '
              />
            </div>
            <button
              type='submit'
              disabled={isLoading}
              className={`
                w-full 
                btn-primary 
                py-2 
                rounded-md 
                transition-colors 
                duration-300 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'}
              `}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
