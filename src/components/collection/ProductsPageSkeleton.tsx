'use client'

import { Plus } from 'lucide-react'
import { SkeletonCircle, SkeletonLine } from '@/components/ui/skeleton'

function SkeletonCard() {
  return (
    <div className="group w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white/60 border border-white/70 shadow-sm shadow-[#3a6b4d]/5 relative isolate">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.7),rgba(227,237,228,0.95))]" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.7)_40%,transparent_60%)] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />

      <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <SkeletonLine className="h-3 w-12 bg-white/60" />
          <SkeletonLine className="h-2.5 w-16 bg-white/50" />
        </div>
        <SkeletonCircle className="w-5 h-5 bg-white/60" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 z-10">
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-3/4 bg-white/70" />
          <SkeletonLine className="h-3 w-1/2 bg-white/50" />
        </div>
      </div>
    </div>
  )
}

function AddCardSkeleton() {
  return (
    <div className="group w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-[#d8e6db] bg-white/45 flex flex-col items-center justify-center gap-2">
      <div className="relative h-12 w-12">
        <SkeletonCircle className="absolute inset-0 bg-[#3a6b4d]/10" />
        <Plus className="h-6 w-6 text-[#3a6b4d]/30" />
      </div>
      <SkeletonLine className="h-3 w-16 bg-[#3a6b4d]/10" />
    </div>
  )
}

export function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-5 pb-20 mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 justify-items-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={`product-skeleton-${i}`} />
        ))}
        <AddCardSkeleton />
      </div>
    </div>
  )
}
