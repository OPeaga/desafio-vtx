import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Gera os ícones (192/512/maskable/apple-touch-icon) a partir do
      // public/favicon.svg e injeta os head links automaticamente.
      pwaAssets: {
        preset: 'minimal-2023',
        image: 'public/favicon.svg',
      },
      manifest: {
        name: 'Desapega UNIFOR — Economia Circular',
        short_name: 'Desapega UNIFOR',
        description:
          'Marketplace de desapego universitário. Venda e doação de livros e materiais acadêmicos na UNIFOR.',
        lang: 'pt-BR',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#3c5387',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  // .env fica na raiz do monorepo (junto do .env do backend), não em frontend/
  envDir: path.resolve(__dirname, '..'),
})
