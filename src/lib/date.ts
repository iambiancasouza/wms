import { format, startOfDay } from 'date-fns'

export function getTodayLocal() {
  return startOfDay(new Date())
}

export function formatDateKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function parseDateKey(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getNextLocalMidnightDelay() {
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setHours(24, 0, 0, 0)

  return nextMidnight.getTime() - now.getTime()
}
