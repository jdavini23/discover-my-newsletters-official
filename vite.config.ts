import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        src: path.resolve(__dirname, './src'),
      },
    },
    define: Object.entries(env).reduce((acc: Record<string, string>, [key, value]) => {
      if (key.startsWith('VITE_FIREBASE_')) {
        acc[`import.meta.env.${key}`] = JSON.stringify(value);
      }
      return acc;
    }, {}),
    server: {
      host: 'localhost',
      port: 3000,  // Specify a default port
      strictPort: false,  // Allow finding an alternative port if 3000 is in use
      open: true,
      cors: true,
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  };
});
