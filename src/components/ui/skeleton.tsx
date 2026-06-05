interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md ${className}`}
    />
  )
}

export function SkeletonLine({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />
}
