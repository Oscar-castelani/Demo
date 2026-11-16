import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ruta base para GitHub Pages: https://oscar-castelani.github.io/Demo/

export default defineConfig({
  base: '/Demo/',
  plugins: [react()],
})
