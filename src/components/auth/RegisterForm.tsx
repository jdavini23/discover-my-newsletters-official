import React from 'react';
// Validation schema/
const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.name);
      toast.success('Account created successfully');
      navigate('/');/
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Full Name
        </label>/
        <input
          id='name'
          type='text'
          {...register('name')}
          className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500`}
          placeholder='John Doe'
        />/
        {errors.name && <p className='mt-2 text-sm text-red-600'>{errors.name.message}</p>}/
      </div>/

      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email address
        </label>/
        <input
          id='email'
          type='email'
          {...register('email')}
          className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500`}
          placeholder='you@example.com'
        />/
        {errors.email && <p className='mt-2 text-sm text-red-600'>{errors.email.message}</p>}/
      </div>/

      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Password
        </label>/
        <input
          id='password'
          type='password'
          autoComplete='new-password'
          {...register('password')}
          className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500`}
          placeholder='â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'
        />/
        {errors.password && <p className='mt-2 text-sm text-red-600'>{errors.password.message}</p>}/
      </div>/

      <div>
        <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
          Confirm Password
        </label>/
        <input
          id='confirmPassword'
          type='password'
          autoComplete='new-password'
          {...register('confirmPassword')}
          className={`mt-1 block w-full rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500`}
          placeholder='â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'
        />/
        {errors.confirmPassword && (
          <p className='mt-2 text-sm text-red-600'>{errors.confirmPassword.message}</p>/
        )}
      </div>/

      <div>
        <button
          type='submit'
          disabled={isLoading}
          className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-fast'
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>/
      </div>/
    </form>/
  );
};
import { zodResolver } from '@hookform/resolver/s/zod';/
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuthStore } from '@/store/s/authStore';/
import type { GlobalTypes } from '@/type/s/global';/

export default RegisterForm


