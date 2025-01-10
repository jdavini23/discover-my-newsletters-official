// vite.config.ts
import {
  defineConfig,
  loadEnv,
} from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/node_modules/vite/dist/node/index.js';
import react from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/node_modules/@vitejs/plugin-react-swc/index.mjs';
import path from 'path';
import tailwindcss from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/node_modules/tailwindcss/lib/index.js';
import autoprefixer from 'file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/node_modules/autoprefixer/lib/autoprefixer.js';
var __vite_injected_original_dirname =
  'C:\\Users\\joeda\\CascadeProjects\\discover-my-newsletterss-1\\discover-my-newsletters-official';
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__vite_injected_original_dirname, './src'),
        src: path.resolve(__vite_injected_original_dirname, './src'),
      },
    },
    define: {
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
    server: {
      host: 'localhost',
      port: 3001,
      strictPort: true,
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqb2VkYVxcXFxDYXNjYWRlUHJvamVjdHNcXFxcZGlzY292ZXItbXktbmV3c2xldHRlcnNzLTFcXFxcZGlzY292ZXItbXktbmV3c2xldHRlcnMtb2ZmaWNpYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvZWRhXFxcXENhc2NhZGVQcm9qZWN0c1xcXFxkaXNjb3Zlci1teS1uZXdzbGV0dGVyc3MtMVxcXFxkaXNjb3Zlci1teS1uZXdzbGV0dGVycy1vZmZpY2lhbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvam9lZGEvQ2FzY2FkZVByb2plY3RzL2Rpc2NvdmVyLW15LW5ld3NsZXR0ZXJzcy0xL2Rpc2NvdmVyLW15LW5ld3NsZXR0ZXJzLW9mZmljaWFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgZmlsZSBiYXNlZCBvbiBgbW9kZWBcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnVklURV8nKTtcblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgICBzcmM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0ZJUkVCQVNFX0FQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9GSVJFQkFTRV9BUElfS0VZKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9BVVRIX0RPTUFJTic6IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0ZJUkVCQVNFX0FVVEhfRE9NQUlOKSxcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9QUk9KRUNUX0lEJzogSlNPTi5zdHJpbmdpZnkoZW52LlZJVEVfRklSRUJBU0VfUFJPSkVDVF9JRCksXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQnOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgZW52LlZJVEVfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVRcbiAgICAgICksXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfTUVTU0FHSU5HX1NFTkRFUl9JRCc6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBlbnYuVklURV9GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lEXG4gICAgICApLFxuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0ZJUkVCQVNFX0FQUF9JRCc6IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0ZJUkVCQVNFX0FQUF9JRCksXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQnOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgZW52LlZJVEVfRklSRUJBU0VfTUVBU1VSRU1FTlRfSURcbiAgICAgICksXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgcG9ydDogMzAwMSxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgY29yczogdHJ1ZSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3MoKSwgYXV0b3ByZWZpeGVyKCldLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRjLFNBQVMsY0FBYyxlQUFlO0FBQ2xmLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFKekIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxPQUFPO0FBRWhELFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDcEMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04seUNBQXlDLEtBQUssVUFBVSxJQUFJLHFCQUFxQjtBQUFBLE1BQ2pGLDZDQUE2QyxLQUFLLFVBQVUsSUFBSSx5QkFBeUI7QUFBQSxNQUN6Riw0Q0FBNEMsS0FBSyxVQUFVLElBQUksd0JBQXdCO0FBQUEsTUFDdkYsZ0RBQWdELEtBQUs7QUFBQSxRQUNuRCxJQUFJO0FBQUEsTUFDTjtBQUFBLE1BQ0EscURBQXFELEtBQUs7QUFBQSxRQUN4RCxJQUFJO0FBQUEsTUFDTjtBQUFBLE1BQ0Esd0NBQXdDLEtBQUssVUFBVSxJQUFJLG9CQUFvQjtBQUFBLE1BQy9FLGdEQUFnRCxLQUFLO0FBQUEsUUFDbkQsSUFBSTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
