'use client'

import { SkeletonCircle, SkeletonLine } from '@/components/ui/skeleton'

export function RoutineDashboardSkeleton() {
  return (
    <section className="relative w-full py-6 z-30">
      <div className="container mx-auto px-6 relative z-10">
        <h3 className="text-lg md:text-xl lg:text-2xl font-black text-[#3a6b4d]/75 uppercase tracking-[0.1em] mb-5 text-center">
          Registrar rotina
        </h3>

        <div className="relative overflow-hidden rounded-[20px] border border-white/70 bg-white/55 shadow-xl shadow-[#3a6b4d]/10 isolate min-h-[560px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(62,107,77,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(142,197,160,0.18),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(240,245,237,0.88))]" />

          <div className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-[#8ec5a0]/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[#3a6b4d]/15 blur-3xl animate-pulse [animation-delay:700ms]" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full border border-[#3a6b4d]/10 animate-[spin_16s_linear_infinite]" />
            <div className="absolute right-[10%] top-[28%] h-24 w-24 rounded-full border border-[#8ec5a0]/20 animate-[spin_12s_linear_infinite_reverse]" />
            <div className="absolute left-[30%] bottom-[14%] h-32 w-32 rounded-full border border-white/60 shadow-[0_0_40px_rgba(58,107,77,0.08)] animate-[pulse_2.8s_ease-in-out_infinite]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-12 p-4 md:p-5">
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0">
              <div className="w-full bg-white/45 backdrop-blur-xl rounded-[32px] p-3 md:p-5 border-2 border-white/30 shadow-xl shadow-[#3a6b4d]/5">
                <div className="flex justify-between items-center mb-3 px-1">
                  <SkeletonCircle className="h-9 w-9 bg-[#3a6b4d]/10" />
                  <SkeletonLine className="h-4 w-36 bg-[#3a6b4d]/10" />
                  <SkeletonCircle className="h-9 w-9 bg-[#3a6b4d]/10" />
                </div>

                <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <span
                      key={`loading-header-${i}`}
                      className="flex h-5 items-center justify-center text-[10px] font-black text-[#3a6b4d]/35 animate-pulse"
                    >
                      {d}
                    </span>
                  ))}

                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={`loading-day-${i}`} className="flex justify-center">
                      <div
                        className="h-8 w-8 rounded-full bg-gradient-to-br from-[#e7f1e8] via-white to-[#dcebdc] bg-[length:200%_200%] animate-[shimmer_1.8s_linear_infinite] shadow-sm shadow-[#3a6b4d]/5"
                        style={{ animationDelay: `${i * 60}ms` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <div className="h-32 lg:h-[140px] rounded-[32px] border-2 border-white/30 bg-white/40 backdrop-blur-xl shadow-sm flex flex-col items-center justify-center gap-3 animate-pulse">
                  <SkeletonCircle className="w-12 h-12 bg-[#3a6b4d]/10" />
                  <SkeletonLine className="h-4 w-16 bg-[#3a6b4d]/10" />
                </div>

                <div className="h-32 lg:h-[140px] rounded-[32px] border-2 border-white/30 bg-white/40 backdrop-blur-xl shadow-sm flex flex-col items-center justify-center gap-3 animate-pulse [animation-delay:250ms]">
                  <SkeletonCircle className="w-12 h-12 bg-[#3a6b4d]/10" />
                  <SkeletonLine className="h-4 w-16 bg-[#3a6b4d]/10" />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex w-full h-full border-2 border-dashed border-[#3a6b4d]/10 rounded-[32px] bg-white/15 flex-col items-center justify-center px-10 text-center">
              <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute h-28 w-28 rounded-full border border-[#3a6b4d]/10 animate-[spin_14s_linear_infinite]" />
                <div className="absolute h-40 w-40 rounded-full border border-[#8ec5a0]/15 animate-[spin_22s_linear_infinite_reverse]" />
                <div className="h-16 w-16 rounded-full bg-white/70 shadow-lg shadow-[#3a6b4d]/10 backdrop-blur-md flex items-center justify-center">
                  <div className="h-7 w-7 rounded-full border-2 border-[#3a6b4d]/25 border-t-[#3a6b4d] animate-spin" />
                </div>
              </div>

              <div className="space-y-2 w-full max-w-sm">
                <div className="h-3 w-3/4 mx-auto rounded-full bg-[#3a6b4d]/10 animate-pulse" />
                <div className="h-3 w-1/2 mx-auto rounded-full bg-[#3a6b4d]/10 animate-pulse [animation-delay:180ms]" />
                <div className="h-3 w-2/3 mx-auto rounded-full bg-[#3a6b4d]/10 animate-pulse [animation-delay:360ms]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
