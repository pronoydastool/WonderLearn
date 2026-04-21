import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// ✅ Bundle analyzer (optional but powerful)
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      tailwindcss(),

      // 🔍 Bundle size check (auto open report)
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
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

    // 🚀 🔥 MAIN OPTIMIZATION PART
    build: {
      chunkSizeWarningLimit: 600, // ⚠️ realistic limit

      rollupOptions: {
        output: {
          manualChunks(id) {
            // 📦 Node modules splitting
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

              return 'vendor';
            }
          }
        }
      }
    }
  };
});