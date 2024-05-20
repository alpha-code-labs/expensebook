import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  resolve: {
      alias: {
          '@': path.resolve(__dirname, './src'),
      },
  },
  server: {
      proxy: {
          '/api': {
              target: 'https://approval-server.victoriousplant-d49987f1.centralindia.azurecontainerapps.io',
              changeOrigin: true,
          },
      },
  },
})
