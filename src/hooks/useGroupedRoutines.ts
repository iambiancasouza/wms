import { useMemo } from 'react'
import { Routine } from '@/types/db'

export function useGroupedRoutines(routines: Routine[]) {
  return useMemo(() => {
    if (!routines || routines.length === 0) return []

    // 1. Ordena todas as rotinas em dois níveis: Data e Período
    const sorted = [...routines].sort((a, b) => {
      // Nível 1: Compara as datas (decrescente)
      const timeA = new Date(`${a.routine_date}T00:00:00`).getTime()
      const timeB = new Date(`${b.routine_date}T00:00:00`).getTime()

      if (timeA !== timeB) {
        return timeB - timeA
      }

      if (a.period === 'diurno' && b.period === 'noturno') return -1
      if (a.period === 'noturno' && b.period === 'diurno') return 1

      return 0
    })

    // 2. Agrupa as rotinas pela data (YYYY-MM-DD)
    const grouped: Record<string, Routine[]> = {}
    sorted.forEach(routine => {
      const date = routine.routine_date as string
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(routine)
    })

    // 3. Formata a saída criando labels amigáveis ("Hoje", "Ontem", etc)
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
        label = routineDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
      }

      return {
        originalDate: date,
        label,
        routines: dayRoutines
      }
    })
  }, [routines])
}