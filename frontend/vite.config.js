
// this is the updted one 
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp'], // Exclude the problematic package
  },
  build: {
    rollupOptions: {
      external: ['mock-aws-s3', 'aws-sdk', 'nock'], // Mark these as external
    },
  },
});