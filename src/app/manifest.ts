import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Where's My Skincare",
    short_name: 'WMS',
    description: 'Sua jornada de skincare personalizada.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f0f5ed',
    theme_color: '#3a6b4d',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
