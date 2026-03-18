import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
})

// --- CONFIGURAÇÃO PWA E SEO (SERVER-SIDE) ---
export const metadata: Metadata = {
  title: "Where's My Skincare",
  description: 'Sua rotina de skincare merece esse cuidado a mais.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WMS'
  }
}

export const viewport: Viewport = {
  themeColor: '#f0f5ed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} ${poppins.variable} antialiased w-full bg-[#f0f5ed]`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <ClientLayout>
          <div className="w-full flex flex-col">{children}</div>
        </ClientLayout>
      </body>
    </html>
  )
}
