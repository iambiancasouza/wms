'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { Navbar } from '@/components/layout/navbar'
import { GlobalProviders } from '@/providers'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div className="relative min-h-[100dvh] w-full pb-4 overflow-x-hidden flex flex-col">
      {pathname !== '/quiz' && <Navbar />}

      <main className="relative flex-1 w-full">
        {!isHome && <StaticLeaves />}
        {children}
      </main>
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
      <GlobalProviders>
        <LayoutContent>{children}</LayoutContent>
      </GlobalProviders>
    </Suspense>
  )
}
