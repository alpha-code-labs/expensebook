import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
      proxy: {
          '/api': {
              // target: 'https://login-server.victoriousplant-d49987f1.centralindia.azurecontainerapps.io',
              target:'http://localhost:8002',
              changeOrigin: true,
          },
      },
  },
})
