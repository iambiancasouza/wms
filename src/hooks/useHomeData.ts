import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/providers/UserAuthProvider'
import { Product, Routine } from '@/types/db'
import { getUserRoutines, getActiveProducts } from '@/services/home.service'

export function useHomeData() {
  const { supabase } = useAuth()

  const [routines, setRoutines] = useState<Routine[]>([])
  const [completedDates, setCompletedDates] = useState<Date[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return

      const routinesData = await getUserRoutines(user.id)

      if (routinesData) {
        setRoutines(routinesData as Routine[])

        const dates = routinesData
          .filter(r => r.routine_date !== null)
          .map(r => {
            const [year, month, day] = r.routine_date!.split('-').map(Number)
            return new Date(year, month - 1, day)
          })

        setCompletedDates(dates)
      }

      const products = await getActiveProducts()

      if (products) {
        setAllProducts(products)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    routines,
    completedDates,
    allProducts,
    loading,
    refresh: fetchData
  }
}
