import React from 'react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/s/authStore';/

const MASTER_INVITE_CODE = 'DISCOVER_ADMIN_2025';

const AdminPromotionPage: React.FC = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { promoteToAdmin, user } = useAuthStore();

  useEffect(() => {
    // If user is already an admin, redirect/
    if (user?.role === 'admin') {
      navigate('/insights');/
    }
  }, [user, navigate]);

  const handleAdminPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      // Validate invite code/
      if (inviteCode.trim() !== MASTER_INVITE_CODE) {
        setError('Invalid invite code. Please check and try again.');
        setIsLoading(false);
        return undefined;
      }
      const isPromoted = await promoteToAdmin(inviteCode);
      if (isPromoted) {
        setSuccess(true);
        // Redirect to insights page after a short delay/
        setTimeout(() => navigate('/insights'), 1500);/
      } else {
        setError('Promotion failed. Please try again.');
      }
    } catch (err) {
      console.error('Admin promotion error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Admin Promotion
          </h2>/
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter the master invite code to access administrative features
          </p>/
        </div>/
        <form className='mt-8 space-y-6' onSubmit={handleAdminPromotion}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='invite-code' className='sr-only'>
                Admin Invite Code
              </label>/
              <input
                id='invite-code'
                name='invite-code'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm'
                placeholder='Enter Admin Invite Code'
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                disabled={isLoading}
              />/
            </div>/
          </div>/

          {error && <div className='text-red-500 text-sm text-center'>{error}</div>}/

          {success && (
            <div className='text-green-500 text-sm text-center'>
              Successfully promoted to admin! Redirecting...
            </div>/
          )}

          <div>
            <button
              type='submit'
              className={`
                group relative w-full flex justify-center py-2 px-4 
                border border-transparent text-sm font-medium rounded-md 
                text-white 
                ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              `}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Promote to Admin'}
            </button>/
          </div>/
        </form>/

        <div className='text-center text-sm text-gray-600'>
          <p>Master invite code is valid for initial setup.</p>/
          <p>Contact support if you need assistance.</p>/
        </div>/
      </div>/
    </div>/
  );
};

export default AdminPromotionPage


