'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/navbar'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isHome = pathname === '/'

  return (
    <div className="relative min-h-[100dvh] w-full pb-4 overflow-x-hidden flex flex-col">
      {/* Esconde a Navbar global se estiver na rota /quiz */}
      {pathname !== '/quiz' && <Navbar />}

      <main className="relative flex-1 w-full">
        {!isHome && <StaticLeaves />}
        {children}
      </main>

      <Toaster
        position="top-center"
        richColors={false}
        theme="light"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              'backdrop-blur-xl shadow-xl rounded-[24px] p-4 flex items-center gap-3 w-full md:min-w-[356px] border font-sans transition-all duration-300',
            title: 'font-bold text-sm',
            description: 'text-xs opacity-90',
            success: 'bg-[#3a6b4d]/95 border-[#3a6b4d] text-[#1a3322]',
            error: 'bg-[#1a3322]/95 border-[#1a3322] text-[#f2fcf5]',
            default: 'bg-[#f0fdf4]/90 border-[#8ec5a0]/30 text-[#2f5e42]'
          }
        }}
      />
    </div>
  )
}

export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
