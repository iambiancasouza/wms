'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
import { useAuth } from '@/providers/UserAuthProvider'
import { Product, Routine } from '@/types/db'
import { getUserRoutines, getActiveProducts } from '@/services/home.service'
import { normalizeDateKey } from '@/lib/date'
import { clearHomeDataCache, getHomeDataCache, setHomeDataCache } from '@/lib/home-data-cache'

interface HomeDataContextData {
  routines: Routine[]
  completedDates: string[]
  allProducts: Product[]
  products: Product[]
  loading: boolean
  error: Error | null
  refresh: (options?: { force?: boolean }) => Promise<void>
}

const HomeDataContext = createContext<HomeDataContextData>({} as HomeDataContextData)

export function HomeDataProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const isMounted = useRef(true)
  const hasFetchedOnce = useRef(false)

  const [routines, setRoutines] = useState<Routine[]>([])
  const [completedDates, setCompletedDates] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const hydrateFromCache = useCallback((userId: string) => {
    const cachedData = getHomeDataCache(userId)

    if (!cachedData) return false

    setRoutines(cachedData.routines)
    setCompletedDates(cachedData.completedDates)
    setAllProducts(cachedData.allProducts)
    setLoading(false)
    hasFetchedOnce.current = true

    return true
  }, [])

  const fetchData = useCallback(async (options?: { force?: boolean }) => {
    const forceRefresh = options?.force ?? false

    if (!user || authLoading) return

    if (!forceRefresh && hydrateFromCache(user.id)) {
      return
    }

    if (forceRefresh) {
      clearHomeDataCache(user.id)
    }

    try {
      setError(null)

      if (!hasFetchedOnce.current && !forceRefresh) {
        setLoading(true)
      }

      const [routinesData, productsData] = await Promise.allSettled([
        getUserRoutines(user.id),
        getActiveProducts(user.id)
      ])

      if (!isMounted.current) return

      let routinesArray: Routine[] | null = null
      let productsArray: Product[] | null = null
      let dates: string[] = []

      if (routinesData.status === 'fulfilled' && routinesData.value) {
        routinesArray = routinesData.value as Routine[]
        setRoutines(routinesArray)

        dates = Array.from(
          new Set(
            routinesArray
              .filter(r => r.routine_date !== null)
              .map(r => normalizeDateKey(r.routine_date!))
          )
        )

        setCompletedDates(dates)
      }

      if (productsData.status === 'fulfilled' && productsData.value) {
        productsArray = productsData.value
        setAllProducts(productsArray)
      }

      if (routinesArray && productsArray) {
        setHomeDataCache(user.id, {
          routines: routinesArray,
          completedDates: dates,
          allProducts: productsArray
        })
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
  }, [user, authLoading, hydrateFromCache])

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
        clearHomeDataCache()
      }
    }
  }, [user, authLoading, fetchData])

  return (
    <HomeDataContext.Provider value={{ 
      routines, 
      completedDates, 
      allProducts, 
      products: allProducts, 
      loading, 
      error, 
      refresh: fetchData 
    }}>
      {children}
    </HomeDataContext.Provider>
  )
}

export const useHomeData = () => useContext(HomeDataContext)
