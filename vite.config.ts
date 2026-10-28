import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          if (url === '/' || url === '/sisceba' || url === '/sisceba/') {
            res.writeHead(302, { Location: '/SISCEBA/' });
            res.end();
            return;
          }
          if (url === '/presentacion' || url === '/presentacion/' || url === '/SISCEBA/presentacion' || url === '/SISCEBA/presentacion/') {
            res.writeHead(302, { Location: '/SISCEBA/presentacion/index.html' });
            res.end();
            return;
          }
          next();
        });
      }
    }
  ],
  base: '/SISCEBA/',
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true
      },
      '/SISCEBA/api': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/SISCEBA/, '')
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true
      },
      '/SISCEBA/api': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/SISCEBA/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        }
      }
    }
  }
})
