import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/react-hot-toast';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { AuthService } from '@/services/authService';
import { PasswordResetModal } from '@/components/auth/PasswordResetModal';

const GoogleIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 48 48'
    width='24'
    height='24'
    className='mr-2'
  >
    <path
      fill='#FFC107'
      d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
    />
    <path
      fill='#FF3D00'
      d='m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z'
    />
    <path
      fill='#4CAF50'
      d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
    />
    <path
      fill='#1976D2'
      d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.801 44 34 44 24c0-1.341-.138-2.65-.389-3.917z'
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
    className='mr-2'
  >
    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await AuthService.signIn(email, password);
        navigate('/newsletters');
      } else {
        await AuthService.signUp(email, password, displayName);
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error(isLogin ? 'Login failed' : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      if (provider === 'google') {
        await AuthService.signInWithGoogle();
      } else {
        await AuthService.signInWithGitHub();
      }
      navigate('/newsletters');
    } catch (error) {
      toast.error(`${provider} login failed`);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-medium'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleEmailAuth}>
          {!isLogin && (
            <div>
              <label htmlFor='displayName' className='sr-only'>
                Display Name
              </label>
              <div className='relative'>
                <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  id='displayName'
                  name='displayName'
                  type='text'
                  required={!isLogin}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className='appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                  placeholder='Display Name'
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor='email' className='sr-only'>
              Email address
            </label>
            <div className='relative'>
              <EnvelopeIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Email address'
              />
            </div>
          </div>

          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <div className='relative'>
              <LockClosedIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Password'
              />
            </div>
          </div>

          {isLogin && (
            <div className='text-right'>
              <button
                type='button'
                onClick={() => setShowPasswordReset(true)}
                className='text-sm text-primary-600 hover:text-primary-700 hover:underline transition-all duration-200 px-2 py-1 rounded-md'
              >
                Forgot password?
              </button>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <button
                type='button'
                onClick={() => setIsLogin(!isLogin)}
                className='font-medium text-primary-600 hover:text-primary-500'
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <button
              type='button'
              onClick={() => handleSocialLogin('google')}
              className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type='button'
              onClick={() => handleSocialLogin('github')}
              className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
            >
              <GitHubIcon />
              GitHub
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal isOpen={showPasswordReset} onClose={() => setShowPasswordReset(false)} />
    </div>
  );
};

export default AuthPage;
