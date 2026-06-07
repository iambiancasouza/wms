import { useEffect, useRef, useState } from 'react'

interface UseInfiniteScrollOptions {
  itemCount: number
  pageSize: number
  enabled?: boolean
}

export function useInfiniteScroll({
  itemCount,
  pageSize,
  enabled = true
}: UseInfiniteScrollOptions) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled || visibleCount >= itemCount) return

    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.isIntersecting) {
          setVisibleCount(current => Math.min(current + pageSize, itemCount))
        }
      },
      {
        rootMargin: '240px 0px',
        threshold: 0
      }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [enabled, itemCount, pageSize, visibleCount])

  return {
    visibleCount,
    loadMoreRef,
    hasMore: visibleCount < itemCount
  }
}
