import { format, startOfDay } from 'date-fns'

export function getTodayLocal() {
  return startOfDay(new Date())
}

export function formatDateKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function normalizeDateKey(date: string) {
  return date.split('T')[0].trim()
}

export function parseDateKey(date: string) {
  const dateOnly = normalizeDateKey(date)
  const [year, month, day] = dateOnly.split('-').map(Number)

  if (!year || !month || !day) {
    throw new Error(`Invalid date key: ${date}`)
  }

  return new Date(year, month - 1, day)
}

export function getNextLocalMidnightDelay() {
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setHours(24, 0, 0, 0)

  return nextMidnight.getTime() - now.getTime()
}
