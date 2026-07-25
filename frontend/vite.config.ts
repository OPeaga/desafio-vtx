import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // .env fica na raiz do monorepo (junto do .env do backend), não em frontend/
  envDir: path.resolve(__dirname, '..'),
})
