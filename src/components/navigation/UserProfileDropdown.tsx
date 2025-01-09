import { LogOut as LogOutIcon, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types/user';

interface UserProfileDropdownProps {
  user: User | null;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full'
      >
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt={`${user.displayName}'s profile`}
          className='w-8 h-8 rounded-full'
        />
        <span className='text-sm font-medium hidden md:inline'>{user.displayName || 'User'}</span>
      </button>

      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg z-50'>
          <div className='px-4 py-3 border-b'>
            <p className='text-sm font-medium text-gray-900'>{user.displayName}</p>
            <p className='text-xs text-gray-500 truncate'>{user.email}</p>
          </div>

          <div className='py-1'>
            <Link
              to='/profile'
              className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className='w-4 h-4 mr-3' />
              Profile
            </Link>

            <Link
              to='/settings'
              className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              onClick={() => setIsOpen(false)}
            >
              <SettingsIcon className='w-4 h-4 mr-3' />
              Settings
            </Link>

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className='w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
            >
              <LogOutIcon className='w-4 h-4 mr-3' />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
