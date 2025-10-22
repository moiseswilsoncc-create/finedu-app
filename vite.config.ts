import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // Asegura que la raíz sea la carpeta actual
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'public/index.html')
    }
  },
  server: {
    port: 3000
  }
})
