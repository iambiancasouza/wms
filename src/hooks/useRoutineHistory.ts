// src/hooks/useRoutineHistory.ts
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'
import { RoutineItem } from '@/types/routine'

export function useRoutineHistory(date: Date) {
  const supabase = createClient()
  const [routines, setRoutines] = useState<RoutineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Pega o início (00:00:00) e o fim (23:59:59) do dia selecionado
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
        if (data) setRoutines(data)
        
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