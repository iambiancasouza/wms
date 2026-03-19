'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
import { useAuth } from '@/providers/UserAuthProvider'
import { Product, Routine } from '@/types/db'
import { getUserRoutines, getActiveProducts } from '@/services/home.service'

interface HomeDataContextData {
  routines: Routine[]
  completedDates: Date[]
  allProducts: Product[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

const HomeDataContext = createContext<HomeDataContextData>({} as HomeDataContextData)

export function HomeDataProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const isMounted = useRef(true)
  const hasFetchedOnce = useRef(false)

  const [routines, setRoutines] = useState<Routine[]>([])
  const [completedDates, setCompletedDates] = useState<Date[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!user || authLoading) return

    try {
      setError(null)
      
      if (!hasFetchedOnce.current) {
        setLoading(true)
      }

      const [routinesData, productsData] = await Promise.allSettled([
        getUserRoutines(user.id),
        getActiveProducts()
      ])

      if (!isMounted.current) return

      if (routinesData.status === 'fulfilled' && routinesData.value) {
        const routinesArray = routinesData.value as Routine[]
        setRoutines(routinesArray)

        const dates = routinesArray
          .filter(r => r.routine_date !== null)
          .map(r => {
            const [year, month, day] = r.routine_date!.split('-').map(Number)
            return new Date(year, month - 1, day)
          })

        setCompletedDates(dates)
      }

      if (productsData.status === 'fulfilled' && productsData.value) {
        setAllProducts(productsData.value)
      }

      hasFetchedOnce.current = true

    } catch (err) {
      if (!isMounted.current) return
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchData()
      } else {
        setLoading(false)
        setRoutines([])
        setAllProducts([])
        setCompletedDates([])
        hasFetchedOnce.current = false
      }
    }
  }, [user, authLoading, fetchData])

  return (
    <HomeDataContext.Provider value={{ routines, completedDates, allProducts, loading, error, refresh: fetchData }}>
      {children}
    </HomeDataContext.Provider>
  )
}

export const useHomeData = () => useContext(HomeDataContext)