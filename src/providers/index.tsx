'use client'

import { AuthProvider } from '@/providers/UserAuthProvider'
import { OnboardingProvider } from '@/providers/OnboardingProvider'
import { ToasterProvider } from '@/providers/ToasterProvider'

interface GlobalProvidersProps {
  children: React.ReactNode
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        {children}
        <ToasterProvider />
      </OnboardingProvider>
    </AuthProvider>
  )
}
