import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import viteJsconfigPaths from 'vite-jsconfig-paths';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), viteJsconfigPaths()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Opcional: para importar variables globales
        // additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/App.jsx'),
      store: path.resolve(__dirname, 'src/store'),
      themes: path.resolve(__dirname, 'src/themes'),

      layout: path.resolve(__dirname, 'src/layout'),
      views: path.resolve(__dirname, 'src/views'),
      assets: path.resolve(__dirname, 'src/assets'),
      config: path.resolve(__dirname, 'src/config'),
      modules: path.resolve(__dirname, 'src/modules'),
      hooks: path.resolve(__dirname, 'src/hooks')
    }
  }
});
