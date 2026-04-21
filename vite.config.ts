import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    // 🚀 Performance Optimization
    build: {
      chunkSizeWarningLimit: 700, // realistic limit

      rollupOptions: {
        output: {
          manualChunks(id) {

            // 📦 Split node_modules
            if (id.includes('node_modules')) {

              if (id.includes('react')) {
                return 'react-vendor';
              }

              if (id.includes('react-router')) {
                return 'router';
              }

              if (id.includes('lucide-react')) {
                return 'icons';
              }

              if (id.includes('motion')) {
                return 'motion';
              }

              // fallback
              return 'vendor';
            }
          }
        }
      }
    }
  };
});