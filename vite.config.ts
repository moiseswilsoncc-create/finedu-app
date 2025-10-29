import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // Asegura que la raíz sea la carpeta actual
  build: {
    // ⚠️ Eliminamos input personalizado que causaba error
    outDir: 'dist', // Puedes especificar el directorio de salida si lo deseas
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // Alias útil para importar desde src
    }
  }
})
