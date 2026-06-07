import { useMemo } from 'react'
import { Routine } from '@/types/db'
import { normalizeDateKey, parseDateKey } from '@/lib/date'
import { useTodayLocal } from '@/hooks/useTodayLocal'

export function useGroupedRoutines(routines: Routine[]) {
  const { today } = useTodayLocal()

  return useMemo(() => {
    if (!routines || routines.length === 0) return []

    const routinesWithDate = routines.filter(
      (routine): routine is Routine & { routine_date: string } =>
        Boolean(routine.routine_date)
    )

    if (routinesWithDate.length === 0) return []

    const sorted = [...routinesWithDate].sort((a, b) => {
      const timeA = parseDateKey(a.routine_date).getTime()
      const timeB = parseDateKey(b.routine_date).getTime()

      if (timeA !== timeB) {
        return timeB - timeA
      }

      if (a.period === 'diurna' && b.period === 'noturna') return -1
      if (a.period === 'noturna' && b.period === 'diurna') return 1

      return 0
    })

    const grouped: Record<string, Routine[]> = {}
    sorted.forEach(routine => {
      const date = normalizeDateKey(routine.routine_date)
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(routine)
    })

    return Object.entries(grouped).map(([date, dayRoutines]) => {
      const routineDate = parseDateKey(date)

      let label = ''
      if (today && routineDate.toDateString() === today.toDateString()) {
        label = 'Hoje'
      } else {
        if (today) {
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          if (routineDate.toDateString() === yesterday.toDateString()) {
            label = 'Ontem'
          } else {
            label = routineDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
          }
        } else {
          label = routineDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
        }
      }

      return {
        originalDate: date,
        label,
        routines: dayRoutines
      }
    })
  }, [routines, today])
}
