'use client'

import { ToasterProvider } from './ToasterProvider'
 

interface GlobalProvidersProps {
  children: React.ReactNode
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
  return (
    <>
    {/* authprovider */}
      {children}
      
      <ToasterProvider />
    </>
  )
}
