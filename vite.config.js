import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Vite reenvía /api al backend publicado en Railway (Spring Boot + MongoDB Atlas).
    proxy: {
      '/api': {
        target: 'https://fitlab-backend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
