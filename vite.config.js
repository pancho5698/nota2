import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fitlab-backend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ['.up.railway.app'],
  },
})
