import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', 
  build: {
    outDir: 'dist-react', 
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Porta padrão do Vite
    strictPort: true,
  }
})