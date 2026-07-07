import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/schedule-manager/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      base: '/schedule-manager/',
      manifest: {
        name: 'スケジュール 持ち物マネージャー',
        short_name: 'スケジュール',
        description: 'スケジュールと持ち物を管理するアプリ',
        theme_color: '#3b82f6',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/schedule-manager/',
        scope: '/schedule-manager/',
        lang: 'ja',
        icons: [
          {
            src: '/schedule-manager/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/schedule-manager/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/schedule-manager/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/schedule-manager/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
          },
        ],
      },
    }),
  ],
})
