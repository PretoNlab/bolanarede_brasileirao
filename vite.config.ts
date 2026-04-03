import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '127.0.0.1',
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;
              if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
              if (id.includes('@supabase')) return 'supabase-vendor';
              if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('clsx')) return 'ui-vendor';
            },
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
