'use client'

import { SkeletonCircle, SkeletonLine } from '@/components/ui/skeleton'

function SkeletonProduct() {
  return (
    <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border border-[#8ec5a0]/20 bg-transparent">
      <div className="absolute inset-[11px] rounded-full border border-white/75 bg-transparent shadow-[0_0_0_1px_rgba(58,107,77,0.04),inset_0_0_24px_rgba(58,107,77,0.06)]" />
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,transparent_26%,rgba(255,255,255,0.7)_45%,transparent_64%)] bg-[length:200%_100%] animate-[shimmer_1.5s_linear_infinite]" />
    </div>
  )
}

function SkeletonRoutineBlock({ tone }: { tone: 'warm' | 'cool' }) {
  const accentClass =
    tone === 'warm'
      ? 'from-[#fdeee4] to-[#f4d7c3] text-[#c78255]'
      : 'from-[#f0f2fb] to-[#e1e6f7] text-[#8695c5]'

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentClass} animate-pulse`} />
          <SkeletonLine className="h-4 w-32 bg-[#3a6b4d]/10" />
        </div>

        <div className="w-9 h-9 rounded-full bg-[#3a6b4d]/10 animate-pulse" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonProduct key={`${tone}-product-${i}`} />
        ))}
      </div>

      <div className={`rounded-3xl border p-4 space-y-2 ${tone === 'warm' ? 'border-[#f0d7c4] bg-[#fff8f1]' : 'border-[#dde4fb] bg-[#f7f8ff]'}`}>
        <SkeletonLine className={`h-3 w-14 ${tone === 'warm' ? 'bg-[#c78255]/20' : 'bg-[#8695c5]/20'}`} />
        <SkeletonLine className={`h-3 w-full ${tone === 'warm' ? 'bg-[#c78255]/10' : 'bg-[#8695c5]/10'}`} />
        <SkeletonLine className={`h-3 w-5/6 ${tone === 'warm' ? 'bg-[#c78255]/10' : 'bg-[#8695c5]/10'}`} />
      </div>
    </div>
  )
}

export function RoutineHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <SkeletonLine className="h-6 w-44 bg-[#3a6b4d]/10" />
          <div className="flex items-center gap-2 pb-4">
            <SkeletonCircle className="w-6 h-6 bg-[#3a6b4d]/10" />
            <SkeletonLine className="h-3 w-48 bg-[#3a6b4d]/10" />
            <SkeletonCircle className="w-6 h-6 bg-[#3a6b4d]/10" />
          </div>
        </div>
        <div className="p-2.5 w-10 h-10 rounded-full bg-[#3a6b4d]/10 animate-pulse" />
      </div>

      <SkeletonRoutineBlock tone="warm" />
      <SkeletonRoutineBlock tone="cool" />
    </div>
  )
}
