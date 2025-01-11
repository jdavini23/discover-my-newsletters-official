// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;
type;
const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged in');
      navigate('/');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email address
        </label>
        <input
          id='email'
          type='email'
          {...register('email')}
          className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500`}
          placeholder='you@example.com'
        />
        {errors.email && <p className='mt-2 text-sm text-red-600'>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Password
        </label>
        <input
          id='password'
          type='password'
          autoComplete='current-password'
          {...register('password')}
          className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500`}
          placeholder='••••••••'
        />
        {errors.password && <p className='mt-2 text-sm text-red-600'>{errors.password.message}</p>}
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            type='checkbox'
            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
          />
          <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
            Remember me
          </label>
        </div>

        <div className='text-sm'>
          <a
            href='/forgot-password'
            className='font-medium text-primary-600 hover:text-primary-500'
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-2 px-4 border border-primary-600 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors'
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};
import type { GlobalTypes } from '@/types/global';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
