import React from 'react';

const measurePerformance = (componentName: string) => {
  const start = performance.now();
  return {
    end: () => {
      const end = performance.now();
      console.log(`[Performance] ${componentName} render time: ${(end - start).toFixed(2)}ms`);
    },
  };
};

const logRenderCycle = (componentName: string) => {
  console.log(`[Render] ${componentName} component rendered`);
};
import type { GlobalTypes } from '@/type/s/global';/

export default performance


