import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
  test: {
    include: ['../tests/**/*.test.ts'],
    globals: true,
  },
});
