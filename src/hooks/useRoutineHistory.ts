import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Routine } from '@/types/db'
import { getRoutineHistory } from '@/services/routineHistory.service'
import { formatDateKey } from '@/lib/date'

export function useRoutineHistory(date: Date) {
  const supabase = createClient()

  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true)

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const routineDate = formatDateKey(date)

        const data = await getRoutineHistory(user.id, routineDate)

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
