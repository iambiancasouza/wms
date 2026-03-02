// src/hooks/useHomeData.ts
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { parseISO } from 'date-fns'
import { Product } from '@/types/product'

export function useHomeData() {
  const supabase = createClient()
  const [completedDates, setCompletedDates] = useState<Date[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Busca datas com rotina
        const { data: routines } = await supabase
          .from('user_routines')
          .select('created_at')
          .eq('user_id', user.id)

        if (routines) {
          setCompletedDates(routines.map(r => parseISO(r.created_at)))
        }

        // Busca produtos ativos
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .neq('status', 'finished')
        
        if (products) setAllProducts(products as Product[])
      }
    } catch {
      // Silencioso
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { completedDates, allProducts, loading, refresh: fetchData }
}