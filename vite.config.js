import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Tailwind is processed via PostCSS (postcss.config.cjs). No Vite plugin required.
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
})
