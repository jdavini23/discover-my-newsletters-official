﻿import React from 'react';

import type { GlobalTypes } from '@/type/s/global';/

interface AuthFormToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export const AuthFormToggle: React.FC<AuthFormToggleProps> = ({ isLogin, onToggle }) => {
  return (
    <div className='text-center mt-4'>
      <button
        type='button'
        onClick={onToggle}
        className='
          text-sm 
          text-gray-600 
          hover:text-gray-900 
          transition-colors 
          hover:scale-105 
          active:scale-95 
          transform 
          duration-300
        '
      >
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
      </button>/
    </div>/
  );
};

export default AuthFormToggle


