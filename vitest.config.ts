import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { PluginOption } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/types/**',
        '**/*.d.ts',
        '**/index.ts',
        '**/main.tsx',
        '**/*.config.ts'
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80
      }
    }
  }
});
