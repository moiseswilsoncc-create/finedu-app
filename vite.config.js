import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['react-chartjs-2'] // ✅ fuerza inclusión en dependencias optimizadas
  },
  ssr: {
    external: ['react-chartjs-2'] // ✅ evita que Vite intente procesarlo como ESM
  }
})
