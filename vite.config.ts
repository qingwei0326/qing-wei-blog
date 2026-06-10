import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: 'ws', host, port: 1421 }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**', '**/docs/**', '**/release/**', '**/dist/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    target:
      process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@codemirror/view')) return 'vendor-codemirror-view';
          if (id.includes('@codemirror/state')) return 'vendor-codemirror-state';
          if (
            id.includes('@codemirror/language') ||
            id.includes('@codemirror/lang-markdown') ||
            id.includes('@codemirror/commands')
          ) {
            return 'vendor-codemirror-language';
          }
          if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
          if (id.includes('marked') || id.includes('dompurify')) {
            return 'vendor-markdown';
          }
          if (id.includes('@radix-ui')) return 'vendor-dialog';
        },
      },
    },
  },
});
