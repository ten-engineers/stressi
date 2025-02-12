import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa"; // Import the PWA plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      manifest: {
        name: 'Stressi App',
        short_name: 'Stressi',
        description: 'Offline-capable Vite + React app',
        theme_color: '#ffffff',
        background_color: '#ffffff',         // ✅ Background color for splash screens
        display: 'standalone',               // ✅ Makes it run like a native app
        orientation: 'portrait',             // ✅ Locks the orientation to portrait
        start_url: '/stressi/',                      // ✅ Defines the launch URL when opened
        scope: '/stressi/',
        icons: [
          {
            "src": "public/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "public/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "public/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "public/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => 
              request.destination === 'document' || 
              request.destination === 'script' || 
              request.destination === 'style',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offline-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
  base: "/stressi",
  build: {
    outDir: "dist",
  },
});