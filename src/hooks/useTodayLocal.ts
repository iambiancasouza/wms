'use client'

import { useSyncExternalStore } from 'react'
import {
  formatDateKey,
  getNextLocalMidnightDelay,
  getTodayLocal
} from '@/lib/date'

type TodaySnapshot = {
  today: Date | null
  todayKey: string
}

let snapshot: TodaySnapshot = {
  today: null,
  todayKey: ''
}

const listeners = new Set<() => void>()
let midnightTimeoutId: ReturnType<typeof setTimeout> | null = null
let isListening = false

function computeSnapshot(): TodaySnapshot {
  const today = getTodayLocal()
  return {
    today,
    todayKey: formatDateKey(today)
  }
}

function emitChange() {
  listeners.forEach(listener => listener())
}

function syncToday() {
  const nextSnapshot = computeSnapshot()

  if (
    snapshot.today &&
    nextSnapshot.today &&
    snapshot.today.getTime() === nextSnapshot.today.getTime()
  ) {
    return
  }

  snapshot = nextSnapshot
  emitChange()
}

function scheduleNextMidnightSync() {
  if (midnightTimeoutId) {
    clearTimeout(midnightTimeoutId)
  }

  midnightTimeoutId = setTimeout(() => {
    syncToday()
    scheduleNextMidnightSync()
  }, getNextLocalMidnightDelay())
}

function handleVisibilityChange() {
  if (!document.hidden) {
    syncToday()
  }
}

function startClock() {
  if (isListening) return

  isListening = true
  snapshot = computeSnapshot()
  scheduleNextMidnightSync()
  window.addEventListener('focus', syncToday)
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

function stopClock() {
  if (!isListening) return

  isListening = false
  if (midnightTimeoutId) {
    clearTimeout(midnightTimeoutId)
    midnightTimeoutId = null
  }
  window.removeEventListener('focus', syncToday)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    startClock()
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      stopClock()
    }
  }
}

function getSnapshot() {
  return snapshot
}

export function useTodayLocal() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
