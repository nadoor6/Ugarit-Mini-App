import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  
  // CRITICAL: This tells Vite what "@" means in your imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
    host: true,
  },

  // NEW: This fixes the "top-level await" error
  build: {
    target: 'es2022' // or 'esnext'
  }
});