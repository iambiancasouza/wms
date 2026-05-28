'use client'

import { AuthProvider } from '@/providers/UserAuthProvider'
import { OnboardingProvider } from '@/providers/OnboardingProvider'
import { ToasterProvider } from '@/providers/ToasterProvider'
import { TodayProvider } from '@/providers/TodayProvider'

interface GlobalProvidersProps {
  children: React.ReactNode
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
  return (
    <TodayProvider>
      <AuthProvider>
        <OnboardingProvider>
          {children}
          <ToasterProvider />
        </OnboardingProvider>
      </AuthProvider>
    </TodayProvider>
  )
}
