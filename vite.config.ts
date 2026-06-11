import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GH_PAGES=1 builds for GitHub Pages (project subpath). Vercel/root builds use '/'.
export default defineConfig({
  base: process.env.GH_PAGES ? '/autism-compass/' : '/',
  plugins: [react()],
})
