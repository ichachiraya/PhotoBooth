import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt', not 'autoUpdate': a silent auto-reload could land mid-capture
      // (camera running, photos shot but not yet saved) and lose that work.
      // We register manually (useRegisterSW, below) and show a small "New
      // version available · Refresh" notice the person can act on when ready.
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png', 'pwa-maskable.png'],
      manifest: {
        name: 'Photo Booth',
        short_name: 'Photo Booth',
        description: 'A quiet, private, on-device 3-frame photo strip booth.',
        theme_color: '#FAF6EF',
        background_color: '#FAF6EF',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Removes the previous deploy's cached assets once the new SW activates,
        // instead of letting old precache versions pile up in storage forever.
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
