import { useMemo } from 'react'
import { Routine } from '@/types/db'
import { parseDateKey } from '@/lib/date'

export function useStreak(routines: Routine[]) {
  return useMemo(() => {
    // 1. Caso base: sem rotinas
    if (!routines || routines.length === 0) {
      return { streak: 0, nextGoal: 7, progressPercent: 0, hasRoutineToday: false }
    }

    // 2. Extrai e limpa as datas únicas
    const uniqueDates = Array.from(
      new Set(
        routines
          .filter(r => r.routine_date !== null)
          .map(r => r.routine_date as string)
      )
    )

    // 3. Converte para milissegundos para facilitar a matemática
    const dateTimes = uniqueDates
      .map(dateStr => parseDateKey(dateStr).getTime())
      .sort((a, b) => b - a) // Mais recente primeiro

    if (dateTimes.length === 0) {
      return { streak: 0, nextGoal: 7, progressPercent: 0, hasRoutineToday: false }
    }

    // 4. Lógica de "Hoje" e "Ontem"
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterday = today - 86400000 // 24h em ms

    // Verifica se a rotina mais recente é a de hoje
    const hasRoutineToday = dateTimes[0] === today

    let currentStreak = 0
    let checkTime = today

    // Se não fez hoje nem ontem, perdeu a ofensiva
    if (dateTimes[0] !== today && dateTimes[0] !== yesterday) {
      return { streak: 0, nextGoal: 7, progressPercent: 0, hasRoutineToday: false }
    }

    // Começa a checar a partir de ontem se não fez hoje
    if (dateTimes[0] === yesterday) {
      checkTime = yesterday
    }

    // 5. Conta os dias
    for (const time of dateTimes) {
      if (time === checkTime) {
        currentStreak++
        checkTime -= 86400000
      } else if (time < checkTime) {
        break
      }
    }

    // 6. Define metas e progresso
    const goals = [7, 14, 21, 30, 50, 100, 365]
    const nextGoal = goals.find(g => g > currentStreak) || currentStreak + 30
    const progressPercent = Math.min((currentStreak / nextGoal) * 100, 100)

    return { 
      streak: currentStreak, 
      nextGoal, 
      progressPercent,
      hasRoutineToday 
    }
  }, [routines])
}
