import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1600
  }
})