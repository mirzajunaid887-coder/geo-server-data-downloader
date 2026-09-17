import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 16000, // Raises the chunk size limit to 1.6MB to clear the warning
  },
});