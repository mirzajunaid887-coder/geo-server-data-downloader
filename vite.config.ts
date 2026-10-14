// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSSG } from 'vite-plugin-ssg-spa';

export default defineConfig({
  plugins: [
    react(),
    viteSSG({
      // Optional: Manually specify routes if auto-discovery misses any.
      // routes: ['/custom-route'],
      // Increase timeout for large apps.
      discoveryTimeout: 600000,
    }),
  ],
  base: '/', // Must be root for Vercel deployments
});