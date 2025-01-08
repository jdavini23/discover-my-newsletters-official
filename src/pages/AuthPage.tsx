import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/lib/react-hot-toast';
import { AuthService } from '@/services/authService';
import { PasswordResetModal } from '@/components/auth/PasswordResetModal';

// New Component Imports
import { AuthFormHeader } from '@/components/auth/AuthFormHeader';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { AuthFormToggle } from '@/components/auth/AuthFormToggle';
import { AuthInput } from '@/components/auth/AuthInput';

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
        <AuthFormHeader isLogin={isLogin} />

        <form onSubmit={handleEmailAuth} className='mt-8 space-y-6'>
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AuthInput
                  type='text'
                  name='displayName'
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    validateDisplayName(e.target.value);
                  }}
                  placeholder='Display Name'
                  icon='user'
                  error={displayNameError}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AuthInput
            type='email'
            name='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            placeholder='Email Address'
            icon='email'
            error={emailError}
          />

          <AuthInput
            type='password'
            name='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            placeholder='Password'
            icon='password'
            error={passwordError}
            showPassword={showPassword}
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          />

          {isLogin && (
            <div className='text-right'>
              <button
                type='button'
                onClick={handleForgotPassword}
                className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>Or continue with</span>
          </div>
        </div>

        <SocialLoginButtons
          onGoogleLogin={() => handleSocialLogin('google')}
          onGitHubLogin={() => handleSocialLogin('github')}
        />

        <AuthFormToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </motion.div>

      {showPasswordReset && (
        <PasswordResetModal
          isOpen={showPasswordReset}
          onClose={() => setShowPasswordReset(false)}
        />
      )}
    </div>
  );
};

export default AuthPage;
