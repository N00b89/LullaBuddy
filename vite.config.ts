import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,        // 👈 allows access via your local IP
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://theta.proto.aalto.fi',
        changeOrigin: true
      }
    }
  }
})