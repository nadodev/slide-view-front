import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Tailwind is processed via PostCSS (postcss.config.cjs). No Vite plugin required.
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
    server: {
    allowedHosts: [
      "003c6b022a11.ngrok-free.app"
    ]
  }
})
