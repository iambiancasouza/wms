import { useMemo } from 'react'
import { Routine } from '@/types/db'

export function useGroupedRoutines(routines: Routine[]) {
  return useMemo(() => {
    if (!routines || routines.length === 0) return []

    const sorted = [...routines].sort((a, b) => {
      const dateA = new Date(`${a.created_at}`)
      const dateB = new Date(`${b.created_at}`)
      return dateB.getTime() - dateA.getTime()
    })

    const grouped: Record<string, Routine[]> = {}
    sorted.forEach(routine => {
      const date = routine.routine_date as string
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(routine)
    })

    return Object.entries(grouped).map(([date, dayRoutines]) => {
      const [year, month, day] = date.split('-').map(Number)
      const routineDate = new Date(year, month - 1, day)

      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let label = ''
      if (routineDate.toDateString() === today.toDateString()) {
        label = 'Hoje'
      } else if (routineDate.toDateString() === yesterday.toDateString()) {
        label = 'Ontem'
      } else {
        label = routineDate
          .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
          .replace('.', '')
      }

      return {
        originalDate: date,
        label,
        routines: dayRoutines
      }
    })
  }, [routines])
}
