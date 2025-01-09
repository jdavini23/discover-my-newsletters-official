import { motion } from 'framer-motion';
import React from 'react';

interface AuthFormToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export const AuthFormToggle: React.FC<AuthFormToggleProps> = ({ isLogin, onToggle }) => {
  return (
    <div className='text-center mt-4'>
      <motion.button
        type='button'
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
      >
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
      </motion.button>
    </div>
  );
};
