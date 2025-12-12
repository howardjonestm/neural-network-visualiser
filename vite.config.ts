import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/neural-network-visualiser/',
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
