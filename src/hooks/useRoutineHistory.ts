import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'
import { RoutineRecord } from '@/types/routine'
import { getRoutineHistory } from '@/services/routineHistory.service'

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

        const data = await getRoutineHistory(user.id, start, end)

        setRoutines(data)

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