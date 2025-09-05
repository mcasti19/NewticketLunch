import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig( {
  theme: {
    extend: {
      fontSize: {
        'fluid-heading': 'clamp(2rem, 5vw, 4rem)', // Ejemplo: para un encabezado
        'fluid-text': 'clamp(1rem, 2vw, 1.5rem)',   // Ejemplo: para texto de párrafo
      },
      spacing: {
        'fluid-gap': 'clamp(1rem, 3vw, 2.5rem)',    // Ejemplo: para espaciado
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
} )
