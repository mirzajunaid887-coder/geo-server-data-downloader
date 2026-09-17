import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gis-layer-downloader/', // Crucial for GitHub Pages subfolder hosting
  build: {
    chunkSizeWarningLimit: 16000,
  },
});