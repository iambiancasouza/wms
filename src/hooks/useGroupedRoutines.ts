import { useEffect, useMemo, useState } from 'react'
import { Routine } from '@/types/db'
import { parseDateKey, getTodayLocal, getNextLocalMidnightDelay } from '@/lib/date'

export function useGroupedRoutines(routines: Routine[]) {
  const [today, setToday] = useState(() => getTodayLocal())

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setToday(getTodayLocal())
    }, getNextLocalMidnightDelay())

    return () => clearTimeout(timeoutId)
  }, [today])

  return useMemo(() => {
    if (!routines || routines.length === 0) return []

    const sorted = [...routines].sort((a, b) => {
      const timeA = parseDateKey(a.routine_date as string).getTime()
      const timeB = parseDateKey(b.routine_date as string).getTime()

      if (timeA !== timeB) {
        return timeB - timeA
      }

      if (a.period === 'diurna' && b.period === 'noturna') return -1
      if (a.period === 'noturna' && b.period === 'diurna') return 1

      return 0
    })

    const grouped: Record<string, Routine[]> = {}
    sorted.forEach(routine => {
      const date = routine.routine_date as string
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(routine)
    })

    return Object.entries(grouped).map(([date, dayRoutines]) => {
      const routineDate = parseDateKey(date)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let label = ''
      if (routineDate.toDateString() === today.toDateString()) {
        label = 'Hoje'
      } else if (routineDate.toDateString() === yesterday.toDateString()) {
        label = 'Ontem'
      } else {
        label = routineDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
      }

      return {
        originalDate: date,
        label,
        routines: dayRoutines
      }
    })
  }, [routines, today])
}
