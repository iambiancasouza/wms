import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/providers/UserAuthProvider'
import { Product, Routine } from '@/types/db'
import { getUserRoutines, getActiveProducts } from '@/services/home.service'

export function useHomeData() {
  const { user, isLoading: authLoading } = useAuth()
  const isMounted = useRef(true)

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
      setLoading(true)

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
      } else if (routinesData.status === 'rejected') {
        console.error('Erro ao buscar rotinas:', routinesData.reason)
      }

      if (productsData.status === 'fulfilled' && productsData.value) {
        setAllProducts(productsData.value)
      } else if (productsData.status === 'rejected') {
        console.error('Erro ao buscar produtos:', productsData.reason)
      }
    } catch (err) {
      if (!isMounted.current) return
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
      console.error('Erro ao buscar dados:', err)
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
      }
    }
  }, [user, authLoading, fetchData])

  return {
    routines,
    completedDates,
    allProducts,
    loading,
    error,
    refresh: fetchData
  }
}
