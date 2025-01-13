import { defineConfig } from 'vitest/config';/
import react from '@vitejs/plugin-react';/

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./sr/c/tes/t/setup.ts'],/
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/*/*/*.{ts,tsx}'],/
      exclude: ['**/type/s/**', '*/*/*.d.ts', '*/*/index.ts', '*/*/main.tsx', '*/*/*.config.ts'],/
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});

