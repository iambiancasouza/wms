'use client'

import { Skeleton, SkeletonCircle, SkeletonLine } from '@/components/ui/skeleton'

function SkeletonCard() {
  return (
    <div className="rounded-[24px] border border-white/40 bg-white/55 backdrop-blur-xl p-4 shadow-sm shadow-[#3a6b4d]/5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl bg-[#3a6b4d]/10" />

        <div className="flex-1 space-y-3 pt-1">
          <SkeletonLine className="h-4 w-3/5 bg-[#3a6b4d]/10" />
          <SkeletonLine className="h-3 w-4/5 bg-[#3a6b4d]/10" />
          <div className="flex items-center gap-2 pt-1">
            <SkeletonLine className="h-5 w-16 bg-[#3a6b4d]/10" />
            <SkeletonLine className="h-5 w-20 bg-[#3a6b4d]/10" />
          </div>
        </div>
      </div>

      <div className="mt-4 h-2.5 w-full rounded-full bg-[#8ec5a0]/15 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#dcebdc] via-[#8ec5a0] to-[#3a6b4d] animate-[shimmer_1.6s_linear_infinite]" />
      </div>
    </div>
  )
}

export function RoutinesPageSkeleton() {
  return (
    <div className="w-full min-h-screen px-5 pt-8 pb-20 flex flex-col gap-6">
      <header className="z-10">
        <SkeletonLine className="h-7 w-40 mb-2 bg-[#3a6b4d]/10" />
        <SkeletonLine className="h-4 w-56 bg-[#3a6b4d]/10" />
      </header>

      <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-5 shadow-md shadow-[#3a6b4d]/5">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl bg-[#3a6b4d]/10" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-4 w-28 bg-[#3a6b4d]/10" />
            <SkeletonLine className="h-3 w-40 bg-[#3a6b4d]/10" />
          </div>
        </div>

        <div className="mt-5 h-2.5 w-full rounded-full bg-[#8ec5a0]/15 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#dcebdc] via-[#8ec5a0] to-[#3a6b4d] animate-[shimmer_1.6s_linear_infinite]" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/40 bg-white/45 backdrop-blur-xl p-2 flex gap-2 shadow-sm">
        <div className="flex-1 h-12 rounded-2xl bg-[#3a6b4d]/10 animate-pulse" />
        <div className="flex-1 h-12 rounded-2xl bg-white/50 border border-white/60 animate-pulse" />
      </div>

      <section className="flex-1 w-full mt-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <SkeletonCircle className="w-4 h-4 bg-[#3a6b4d]/20" />
            <SkeletonLine className="h-8 w-24 bg-[#3a6b4d]/10" />
          </div>

          <div className="pl-8 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`timeline-skeleton-${i}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
