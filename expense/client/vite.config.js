import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

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
              target: 'https://expense-server.victoriousplant-d49987f1.centralindia.azurecontainerapps.io',
              changeOrigin: true,
          },
      },
  },
});

