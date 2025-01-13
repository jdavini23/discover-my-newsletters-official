import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'src': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react({
        babel: {
          plugins: [
            '@emotion/babel-plugin',
          ],
        },
      }),
      sentryVitePlugin({
        org: "discover-my-newsletters",
        project: "javascript-react",
        authToken: process.env.SENTRY_AUTH_TOKEN
      })
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss('./tailwind.config.js'),
          autoprefixer(),
        ],
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      open: true,
      hmr: {
        overlay: true,
      },
    },
    optimizeDeps: {
      include: [
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion',
        'react-icons',
        'react-router-dom',
      ],
      force: true,
      esbuildOptions: {
        target: 'es2020',
      },
    },
    build: {
      minify: 'terser',
      sourcemap: true,
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  };
});
