import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Esto permitirá conexiones externas
    port: 5173        // Asegúrate de que sea el puerto correcto
  }
})
