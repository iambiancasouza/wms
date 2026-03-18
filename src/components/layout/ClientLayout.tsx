'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { StaticLeaves } from '@/components/layout/staticLeaves'
import { Navbar } from '@/components/layout/navbar'
import { BottomNavbar } from '@/components/layout/BottomNavbar'
import { GlobalProviders } from '@/providers'
import { useOnboarding } from '@/providers/OnboardingProvider'
import { useAuth } from '@/providers/UserAuthProvider'
import OnboardingModal from '@/components/modals/OnboardingModal'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { isOpen, openOnboarding, closeOnboarding } = useOnboarding()
  const { profile, isLoggedIn, isLoading } = useAuth()
  const hasShownOnboarding = useRef(false)

  useEffect(() => {
    if (
      !isLoading &&
      isLoggedIn &&
      profile &&
      profile.onboarding_completed !== true &&
      !hasShownOnboarding.current
    ) {
      const onboardingTimeout = setTimeout(() => {
        openOnboarding()
        hasShownOnboarding.current = true
      }, 10000)

      return () => clearTimeout(onboardingTimeout)
    }
  }, [profile, isLoading, isLoggedIn, openOnboarding])

  return (
    <div className="relative min-h-[100dvh] w-full pb-28 md:pb-6 overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="relative flex-1 w-full">
        {!isHome && <StaticLeaves />}
        {children}
      </main>

      <OnboardingModal isOpen={isOpen} onCloseAction={closeOnboarding} />
      <BottomNavbar />
    </div>
  )
}

export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalProviders>
      <LayoutContent>{children}</LayoutContent>
    </GlobalProviders>
  )
}
