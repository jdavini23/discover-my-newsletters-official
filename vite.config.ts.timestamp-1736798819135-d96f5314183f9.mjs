// vite.config.ts
import react from "file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/node_modules/@vitejs/plugin-react/dist/index.mjs";
import autoprefixer from "file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/node_modules/autoprefixer/lib/autoprefixer.js";
import path from "path";
import tailwindcss from "file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/node_modules/tailwindcss/lib/index.js";
import { defineConfig, loadEnv } from "file:///C:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "c:\\Users\\joeda\\CascadeProjects\\discover-my-newsletterss-1\\discover-my-newsletters-official";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        src: path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    define: Object.entries(env).reduce((acc, [key, value]) => {
      if (key.startsWith("VITE_FIREBASE_")) {
        acc[`import.meta.env.${key}`] = JSON.stringify(value);
      }
      return acc;
    }, {}),
    server: {
      host: "localhost",
      port: 3e3,
      // Specify a default port
      strictPort: false,
      // Allow finding an alternative port if 3000 is in use
      open: true,
      cors: true
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxqb2VkYVxcXFxDYXNjYWRlUHJvamVjdHNcXFxcZGlzY292ZXItbXktbmV3c2xldHRlcnNzLTFcXFxcZGlzY292ZXItbXktbmV3c2xldHRlcnMtb2ZmaWNpYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImM6XFxcXFVzZXJzXFxcXGpvZWRhXFxcXENhc2NhZGVQcm9qZWN0c1xcXFxkaXNjb3Zlci1teS1uZXdzbGV0dGVyc3MtMVxcXFxkaXNjb3Zlci1teS1uZXdzbGV0dGVycy1vZmZpY2lhbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYzovVXNlcnMvam9lZGEvQ2FzY2FkZVByb2plY3RzL2Rpc2NvdmVyLW15LW5ld3NsZXR0ZXJzcy0xL2Rpc2NvdmVyLW15LW5ld3NsZXR0ZXJzLW9mZmljaWFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIGVudiBmaWxlIGJhc2VkIG9uIGBtb2RlYFxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICdWSVRFXycpO1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgIHNyYzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiBPYmplY3QuZW50cmllcyhlbnYpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnVklURV9GSVJFQkFTRV8nKSkge1xuICAgICAgICBhY2NbYGltcG9ydC5tZXRhLmVudi4ke2tleX1gXSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pLFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBwb3J0OiAzMDAwLCAgLy8gU3BlY2lmeSBhIGRlZmF1bHQgcG9ydFxuICAgICAgc3RyaWN0UG9ydDogZmFsc2UsICAvLyBBbGxvdyBmaW5kaW5nIGFuIGFsdGVybmF0aXZlIHBvcnQgaWYgMzAwMCBpcyBpbiB1c2VcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBjb3JzOiB0cnVlLFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcygpLCBhdXRvcHJlZml4ZXIoKV0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNGMsT0FBTyxXQUFXO0FBQzlkLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGNBQWMsZUFBZTtBQUp0QyxJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLE9BQU87QUFFaEQsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxRQUNwQyxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRLE9BQU8sUUFBUSxHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssTUFBTTtBQUN4RCxVQUFJLElBQUksV0FBVyxnQkFBZ0IsR0FBRztBQUNwQyxZQUFJLG1CQUFtQixHQUFHLEVBQUUsSUFBSSxLQUFLLFVBQVUsS0FBSztBQUFBLE1BQ3REO0FBQ0EsYUFBTztBQUFBLElBQ1QsR0FBRyxDQUFDLENBQUM7QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sWUFBWTtBQUFBO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
