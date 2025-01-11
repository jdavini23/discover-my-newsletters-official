import { useState, useEffect } from 'react';

export const useAnimatedVisibility = (delay = 50) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const visibilityClasses = {
    container: `
      transition-all duration-1000 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
    `,
    content: `
      transition-all duration-1000 
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
    `
  };

  return { isVisible, visibilityClasses };
};
