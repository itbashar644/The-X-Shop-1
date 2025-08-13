import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from "vite-plugin-compression";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    // Make environment variables available to the client
    'process.env.VERCEL': JSON.stringify(process.env.VERCEL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
  },
  build: {
    minify: 'terser',
    sourcemap: mode === 'development',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['@supabase/supabase-js', '@tanstack/react-query'],
          charts: ['recharts', 'xlsx', 'framer-motion'],
        }
      }
    },
  },
  server: {
    host: "::",
    port: 3000,
    strictPort: false,
    headers: {
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    },
    historyApiFallback: true
  },
  base: '/',
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
