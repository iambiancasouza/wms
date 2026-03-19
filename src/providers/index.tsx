'use client'

import { AuthProvider } from '@/providers/UserAuthProvider'
import { OnboardingProvider } from '@/providers/OnboardingProvider'
import { ToasterProvider } from '@/providers/ToasterProvider'
import { HomeDataProvider } from '@/providers/HomeDataProvider'

interface GlobalProvidersProps {
  children: React.ReactNode
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HomeDataProvider> 
          {children}
          <ToasterProvider />
        </HomeDataProvider>
        <ToasterProvider />
      </OnboardingProvider>
    </AuthProvider>
  )
}