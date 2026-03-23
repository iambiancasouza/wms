'use client'

import { motion } from 'framer-motion'
import { Routine } from '@/types/db'
import { useGroupedRoutines } from '@/hooks/useGroupedRoutines'
import { RoutineCard } from './RoutineCard'

interface RoutineTimelineProps {
  routines: Routine[]
}

export function RoutineTimeline({ routines }: RoutineTimelineProps) {
  const groupedRoutines = useGroupedRoutines(routines)

  if (groupedRoutines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#3a6b4d]/60">
        <p>Nenhuma rotina registrada ainda.</p>
        <p className="text-sm">Seu histórico aparecerá aqui.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full mt-4 pl-1 pb-10">
      {/*Linha Vertical*/}
      <div className="absolute left-2.5 top-4 bottom-0 w-0.5 bg-gradient-to-b from-[#8ec5a0] to-transparent opacity-50" />

      <div className="flex flex-col gap-8">
        {groupedRoutines.map((group, groupIndex) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            key={group.originalDate}
            className="relative w-full"
          >
            {/* Bolinha da Data e Texto (Hoje, Ontem, etc) */}
            <div className="flex items-center gap-4 mb-4">
              {/* Bolinha Verde */}
              <div className="w-4 h-4 rounded-full bg-[#3a6b4d]/75 border-2 backdrop-blur-md border-gray-100 -ml-[1.5px]" />

              <span className="text-sm font-bold text-[#2f5e42] bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-[#8ec5a0]/30 shadow-sm">
                {group.label}
              </span>
            </div>

            <div className="flex flex-col gap-4 pl-8">
              {group.routines.map(routine => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
