import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importez le module path

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,  // Désactive complètement la génération des source maps
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
