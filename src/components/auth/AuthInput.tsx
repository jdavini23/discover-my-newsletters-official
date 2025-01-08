import React from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

interface AuthInputProps {
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  icon?: 'user' | 'email' | 'password';
  showPassword?: boolean;
  onTogglePasswordVisibility?: () => void;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  showPassword,
  onTogglePasswordVisibility
}) => {
  const renderIcon = () => {
    const iconProps = {
      className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400'
    };

    switch (icon) {
      case 'user':
        return <UserIcon {...iconProps} />;
      case 'email':
        return <EnvelopeIcon {...iconProps} />;
      case 'password':
        return <LockClosedIcon {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className='mb-4'>
      <div className='relative'>
        {renderIcon()}
        <input
          id={name}
          name={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`appearance-none rounded-md relative block w-full 
            ${icon ? 'px-3 py-2 pl-10' : 'px-3 py-2'} 
            border ${error ? 'border-red-500' : 'border-gray-300'} 
            placeholder-gray-500 text-gray-900 
            focus:outline-none focus:ring-0 focus:border-gray-300 
            sm:text-sm`}
        />
        {type === 'password' && onTogglePasswordVisibility && (
          <button
            type='button'
            onClick={onTogglePasswordVisibility}
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
        )}
      </div>
      {error && (
        <p className='mt-2 text-sm text-red-600'>{error}</p>
      )}
    </div>
  );
};
