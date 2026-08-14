import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/account-ui',
  plugins: [react()],
  server: {
    allowedHosts: ['app.people4.eu'],
    config: {
      host: 'app.people4.eu',
      port: 5173,
    },
  },
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});
