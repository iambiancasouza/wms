// src/hooks/useRoutineHistory.ts
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'
import { Product } from '@/types/product'

// É ESTA PARTE AQUI QUE ESTÁ FALTANDO OU SEM O "export" AÍ NO SEU ARQUIVO:
export interface RoutineRecord {
  id: string
  user_id: string
  period: 'diurna' | 'noturna'
  products: Product[]
  created_at: string
}

export function useRoutineHistory(date: Date) {
  const supabase = createClient()
  const [routines, setRoutines] = useState<RoutineRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const start = startOfDay(date).toISOString()
        const end = endOfDay(date).toISOString()

        const { data, error } = await supabase
          .from('user_routines')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', start)
          .lte('created_at', end)
          .order('created_at', { ascending: true })

        if (error) throw error
        
        if (data) setRoutines(data as RoutineRecord[])
        
      } catch (error) {
        console.error('Erro ao buscar histórico:', error)
      } finally {
        setLoading(false)
      }
    }

    if (date) fetchHistory()
  }, [date, supabase])

  return { routines, loading }
}