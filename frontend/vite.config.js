import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // escucha en 0.0.0.0 (necesario en Docker)
    port: 5173,     // puerto por defecto de Vite
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // el servicio "backend" en docker-compose
        changeOrigin: true,
      },
    },
  },
})