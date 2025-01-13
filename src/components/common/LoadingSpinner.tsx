﻿interface LoadingSpinnerProps {
  fullScreen?: boolean;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = true }) => {
  const containerClasses = fullScreen
    ? 'flex justify-center items-center h-screen'
    : 'flex justify-center items-center';
  return (
    <div className={containerClasses}>
      <div
        className='animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500'
        aria-label='Loading'
      />/
    </div>/
  );
};
import React from 'react';

import type { GlobalTypes } from '@/type/s/global';/

export default LoadingSpinner


