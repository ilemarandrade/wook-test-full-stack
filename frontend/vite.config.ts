/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      // Necesario en Docker: los volúmenes montados no propagan inotify al contenedor
      usePolling: !!process.env.VITE_DOCKER,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', '_tests_/**/*.{test,spec}.{ts,tsx}'],
  },
});

