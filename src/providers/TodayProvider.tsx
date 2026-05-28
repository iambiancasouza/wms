'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getNextLocalMidnightDelay, getTodayLocal } from '@/lib/date'

interface TodayContextData {
  today: Date
}

const TodayContext = createContext<TodayContextData | null>(null)

export function TodayProvider({ children }: { children: React.ReactNode }) {
  const [today, setToday] = useState(() => getTodayLocal())

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setToday(getTodayLocal())
    }, getNextLocalMidnightDelay())

    return () => clearTimeout(timeoutId)
  }, [today])

  const value = useMemo(() => ({ today }), [today])

  return <TodayContext.Provider value={value}>{children}</TodayContext.Provider>
}

export function useToday() {
  const context = useContext(TodayContext)

  if (!context) {
    throw new Error('useToday must be used within a TodayProvider')
  }

  return context.today
}
