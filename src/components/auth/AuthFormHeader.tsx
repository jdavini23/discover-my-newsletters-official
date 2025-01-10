import React from 'react';

interface AuthFormHeaderProps {
  isLogin: boolean;
}

export const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({ isLogin }) => {
  return (
    <div>
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 mb-2'>
        {isLogin ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      <p className='text-center text-gray-500'>
        {isLogin
          ? 'Sign in to continue exploring newsletters'
          : 'Join our community of newsletter enthusiasts'}
      </p>
    </div>
  );
};
