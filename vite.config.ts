import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' makes the build work from any folder, so the GitHub Pages
// address keeps working even if the repository is renamed.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  define: { global: 'globalThis' },
  build: { chunkSizeWarningLimit: 1500 },
})
