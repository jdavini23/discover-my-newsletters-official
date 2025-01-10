// vite.config.ts
import {
  defineConfig,
  loadEnv,
} from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/node_modules/vite/dist/node/index.js';
import react from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/node_modules/@vitejs/plugin-react-swc/index.mjs';
import path from 'path';
import tailwindcss from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/node_modules/tailwindcss/lib/index.js';
import autoprefixer from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/node_modules/autoprefixer/lib/autoprefixer.js';
var __vite_injected_original_dirname =
  'C:\\Users\\joeda\\CascadeProjects\\discover-my-newsletterss-1\\discover-my-newsletters-official';
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__vite_injected_original_dirname, './src'),
        src: path.resolve(__vite_injected_original_dirname, './src'),
      },
    },
    server: {
      host: 'localhost',
      port: 3e3,
      strictPort: true,
      open: true,
      cors: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: path.resolve(__vite_injected_original_dirname, 'tailwind.config.js'),
          }),
          autoprefixer(),
        ],
      },
    },
    define: {
      // Expose environment variables to the app
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
        env.VITE_FIREBASE_STORAGE_BUCKET
      ),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
        env.VITE_FIREBASE_MESSAGING_SENDER_ID
      ),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
      'import.meta.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(
        env.VITE_FIREBASE_MEASUREMENT_ID
      ),
    },
  };
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqb2VkYVxcXFxDYXNjYWRlUHJvamVjdHNcXFxcZGlzY292ZXItbXktbmV3c2xldHRlcnNzLTFcXFxcZGlzY292ZXItbXktbmV3c2xldHRlcnMtb2ZmaWNpYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvZWRhXFxcXENhc2NhZGVQcm9qZWN0c1xcXFxkaXNjb3Zlci1teS1uZXdzbGV0dGVyc3MtMVxcXFxkaXNjb3Zlci1teS1uZXdzbGV0dGVycy1vZmZpY2lhbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvam9lZGEvQ2FzY2FkZVByb2plY3RzL2Rpc2NvdmVyLW15LW5ld3NsZXR0ZXJzcy0xL2Rpc2NvdmVyLW15LW5ld3NsZXR0ZXJzLW9mZmljaWFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIC8vIExvYWQgZW52IGZpbGUgYmFzZWQgb24gYG1vZGVgXHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgICBzcmM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcclxuICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgY29yczogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwb3N0Y3NzOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgdGFpbHdpbmRjc3Moe1xyXG4gICAgICAgICAgICBjb25maWc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICd0YWlsd2luZC5jb25maWcuanMnKSxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgYXV0b3ByZWZpeGVyKCksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgLy8gRXhwb3NlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byB0aGUgYXBwXHJcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52LlZJVEVfRklSRUJBU0VfQVBJX0tFWSksXHJcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9BVVRIX0RPTUFJTic6IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0ZJUkVCQVNFX0FVVEhfRE9NQUlOKSxcclxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0ZJUkVCQVNFX1BST0pFQ1RfSUQnOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9GSVJFQkFTRV9QUk9KRUNUX0lEKSxcclxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VUJzogSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgZW52LlZJVEVfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVRcclxuICAgICAgKSxcclxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQnOiBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICBlbnYuVklURV9GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lEXHJcbiAgICAgICksXHJcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9BUFBfSUQnOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9GSVJFQkFTRV9BUFBfSUQpLFxyXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQnOiBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICBlbnYuVklURV9GSVJFQkFTRV9NRUFTVVJFTUVOVF9JRFxyXG4gICAgICApLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0YyxTQUFTLGNBQWMsZUFBZTtBQUNsZixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBSnpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBRXhDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUUzQyxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQ3BDLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBLFVBQ1AsWUFBWTtBQUFBLFlBQ1YsUUFBUSxLQUFLLFFBQVEsa0NBQVcsb0JBQW9CO0FBQUEsVUFDdEQsQ0FBQztBQUFBLFVBQ0QsYUFBYTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsTUFFTix5Q0FBeUMsS0FBSyxVQUFVLElBQUkscUJBQXFCO0FBQUEsTUFDakYsNkNBQTZDLEtBQUssVUFBVSxJQUFJLHlCQUF5QjtBQUFBLE1BQ3pGLDRDQUE0QyxLQUFLLFVBQVUsSUFBSSx3QkFBd0I7QUFBQSxNQUN2RixnREFBZ0QsS0FBSztBQUFBLFFBQ25ELElBQUk7QUFBQSxNQUNOO0FBQUEsTUFDQSxxREFBcUQsS0FBSztBQUFBLFFBQ3hELElBQUk7QUFBQSxNQUNOO0FBQUEsTUFDQSx3Q0FBd0MsS0FBSyxVQUFVLElBQUksb0JBQW9CO0FBQUEsTUFDL0UsZ0RBQWdELEtBQUs7QUFBQSxRQUNuRCxJQUFJO0FBQUEsTUFDTjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
