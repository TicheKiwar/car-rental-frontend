import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Esto permitirá conexiones externas
    port: 5173        // Asegúrate de que sea el puerto correcto
  },
  build: {
    outDir: 'dist',    // Asegúrate de que la salida se genere en la carpeta 'dist'
    target: 'esnext',  // Asegura compatibilidad con los navegadores modernos
    minify: 'esbuild', // Usa esbuild para minimizar el código, es más rápido
    sourcemap: true    // Habilita los mapas de origen para facilitar la depuración
  }
})
