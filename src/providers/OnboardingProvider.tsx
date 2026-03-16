'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { saveOnboarding } from '@/services/onboarding.service' 

interface OnboardingContextData {
  isOpen: boolean
  openOnboarding: () => void
  closeOnboarding: () => void
  birthDate: string
  setBirthDate: (val: string) => void
  skinType: string[]
  setSkinType: (val: string[]) => void
  concerns: string[]
  setConcerns: (val: string[]) => void
  submitOnboarding: () => Promise<void>
  isSaving: boolean
}

const OnboardingContext = createContext<OnboardingContextData>({} as OnboardingContextData)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [skinType, setSkinType] = useState<string[]>([])
  const [concerns, setConcerns] = useState<string[]>([])

  const openOnboarding = () => setIsOpen(true)
  const closeOnboarding = () => setIsOpen(false)

  async function submitOnboarding() {
    setIsSaving(true)
    try {
      await saveOnboarding({ birth_date: birthDate, skin_type: skinType, concerns })
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <OnboardingContext.Provider value={{ 
      isOpen, openOnboarding, closeOnboarding, 
      birthDate, setBirthDate, skinType, setSkinType, 
      concerns, setConcerns, submitOnboarding, isSaving 
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => useContext(OnboardingContext)