import { Product, Routine } from '@/types/db'

export interface HomeDataSnapshot {
  routines: Routine[]
  completedDates: string[]
  allProducts: Product[]
  fetchedAt: number
}

const homeDataCache = new Map<string, HomeDataSnapshot>()

export function getHomeDataCache(userId: string) {
  return homeDataCache.get(userId) ?? null
}

export function setHomeDataCache(
  userId: string,
  snapshot: Omit<HomeDataSnapshot, 'fetchedAt'>
) {
  homeDataCache.set(userId, {
    ...snapshot,
    fetchedAt: Date.now()
  })
}

export function clearHomeDataCache(userId?: string) {
  if (userId) {
    homeDataCache.delete(userId)
    return
  }

  homeDataCache.clear()
}
