import type { GlobalTypes } from '@/types/global';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimatedVisibility } from '@/hooks/useAnimatedVisibility';

const HomeCTA: React.FC = () => {
  const navigate = useNavigate();
  const { visibilityClasses } = useAnimatedVisibility();

  return (
    <div
      className={`
        w-full 
        bg-gradient-to-r from-primary-600 to-primary-500 
        px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 
        ${visibilityClasses.container}
      `}
    >
      <div className='w-full max-w-7xl mx-auto py-16 text-center'>
        <div
          className={`
            bg-white/10 backdrop-blur-sm 
            rounded-xl p-8 md:p-12 
            ${visibilityClasses.content}
          `}
        >
          <h2 className='text-3xl md:text-4xl font-extrabold text-white mb-4'>
            Start Your Newsletter Journey Today
          </h2>
          <p className='text-lg text-white/80 max-w-2xl mx-auto mb-8'>
            Join thousands of curious minds discovering incredible newsletters that spark
            inspiration, knowledge, and joy.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className='
              bg-white text-primary-600 
              hover:bg-primary-50 
              px-6 py-3 
              rounded-full 
              font-semibold 
              transition-colors 
              duration-300 
              ease-in-out
            '
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeCTA;
