import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/lib/react-hot-toast';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!re.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateDisplayName = (name: string) => {
    if (!isLogin && !name) {
      setDisplayNameError('Display name is required');
      return false;
    }
    setDisplayNameError('');
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isDisplayNameValid = !isLogin ? validateDisplayName(displayName) : true;

    if (!isEmailValid || !isPasswordValid || !isDisplayNameValid) {
      return;
    }

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

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  // Reset errors when switching between login/signup
  useEffect(() => {
    setEmailError('');
    setPasswordError('');
    setDisplayNameError('');
  }, [isLogin]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className='max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100'
      >
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

        <form onSubmit={handleEmailAuth} className='mt-8 space-y-6'>
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor='displayName' className='sr-only'>
                  Display Name
                </label>
                <div className='relative'>
                  <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                  <input
                    id='displayName'
                    name='displayName'
                    type='text'
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      validateDisplayName(e.target.value);
                    }}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${
                      displayNameError 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder='Display Name'
                  />
                  {displayNameError && (
                    <p className='mt-2 text-sm text-red-600'>{displayNameError}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${
                  emailError 
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder='Email address'
              />
              {emailError && (
                <p className='mt-2 text-sm text-red-600'>{emailError}</p>
              )}
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
                type={showPassword ? 'text' : 'password'}
                required
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 hover:text-gray-600
                focus:outline-none focus:ring-0 rounded-full p-1'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 
                  <EyeSlashIcon className='h-5 w-5 text-current' /> : 
                  <EyeIcon className='h-5 w-5 text-current' />
                }
              </button>
              {passwordError && (
                <p className='mt-2 text-sm text-red-600'>{passwordError}</p>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-[#6A82FB] focus:ring-[#FC5C7D] border-gray-300 rounded'
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-neutral-text-700'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <button
                type='button'
                onClick={handleForgotPassword}
                className='font-medium text-[#333333] hover:text-[#4A90E2] 
                transition-colors duration-200 hover:underline 
                focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-2 -mx-2
                bg-transparent hover:bg-blue-50 py-1'
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center items-center py-3 px-4 border-none text-sm font-semibold rounded-lg text-white 
              bg-gradient-to-r from-[#6A82FB] to-[#FC5C7D] 
              hover:from-[#5A72EB] hover:to-[#E44B6B]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 
              transition-all duration-300 ease-in-out 
              transform hover:scale-[1.02] active:scale-[0.98]
              disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className='text-center'>
            <button
              type='button'
              onClick={() => setIsLogin(!isLogin)}
              className='font-medium text-[#333333] hover:text-[#4A90E2] 
              transition-colors duration-200 hover:underline 
              focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-2 -mx-2 text-sm
              bg-transparent hover:bg-blue-50 py-1'
            >
              {isLogin 
                ? 'Need an account? Create a new account' 
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-600'>Or continue with</span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <button
              type='button'
              onClick={() => handleSocialLogin('google')}
              className='w-full inline-flex justify-center items-center py-2 px-4 
              border border-gray-300 rounded-lg 
              bg-white text-gray-700 
              hover:bg-gray-50 hover:border-[#6A82FB] 
              focus:outline-none focus:ring-2 focus:ring-blue-200
              transition-all duration-200 
              font-semibold space-x-2'
            >
              <GoogleIcon className='w-5 h-5' />
              <span>Google</span>
            </button>
            <button
              type='button'
              onClick={() => handleSocialLogin('github')}
              className='w-full inline-flex justify-center items-center py-2 px-4 
              rounded-lg 
              bg-gray-900 text-white 
              hover:bg-gray-800 
              focus:outline-none focus:ring-2 focus:ring-gray-500
              transition-all duration-200 
              font-semibold space-x-2'
            >
              <GitHubIcon className='w-5 h-5' />
              <span>GitHub</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Password Reset Modal */}
      <PasswordResetModal isOpen={showPasswordReset} onClose={() => setShowPasswordReset(false)} />
    </div>
  );
};

export default AuthPage;
