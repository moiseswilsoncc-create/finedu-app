import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['react-chartjs-2'] // ✅ evita que Vite intente procesarlo como ESM
    }
  },
  server: {
    port: 5173, // 🔧 frontend fijo en 5173
    open: true  // abre el navegador automáticamente
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
    external: ['react-chartjs-2'] // ✅ evita que Vite lo procese en modo SSR
  }
})
