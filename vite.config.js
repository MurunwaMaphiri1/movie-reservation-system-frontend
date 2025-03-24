import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  content: [
    '.../path/to/flatpickr/**/*.js', // Include all relevant JS files from Flatpickr
  ],
  plugins: [
    react(),
    tailwindcss(),
  ],
  flyonui: {
    vendors: true // Enable vendor-specific CSS generation
  }
})
