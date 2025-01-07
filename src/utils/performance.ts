// src/utils/performance.ts
export const measurePerformance = (componentName: string) => {
  const start = performance.now();

  return {
    end: () => {
      const end = performance.now();
      console.log(`[Performance] ${componentName} render time: ${(end - start).toFixed(2)}ms`);
    },
  };
};

export const logRenderCycle = (componentName: string) => {
  console.log(`[Render] ${componentName} component rendered`);
};
