'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { Routine } from '@/types/db'
import { useStreak } from '@/hooks/useStreak'

interface StreakCardProps {
  routines: Routine[]
}

export function StreakCard({ routines }: StreakCardProps) {
  // Agora recebemos o hasRoutineToday direto do hook
  const { streak, nextGoal, progressPercent, hasRoutineToday } = useStreak(routines)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full overflow-hidden bg-white/30 backdrop-blur-md border border-white/1 rounded-3xl p-5 shadow-md"
    >
      <div className="flex items-start gap-4">
        {/* Ícone com animação de "acender" */}
        <motion.div 
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-colors duration-500 ${
            hasRoutineToday ? 'bg-[#3a6b4d]/15' : 'bg-gray-200/50'
          }`}
          // O array [1, 1.2, 1] faz o ícone dar um "pulo" rápido quando acende
          animate={{
            scale: hasRoutineToday ? [1, 1.2, 1] : 1, 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Flame 
            className={`w-6 h-6 transition-all duration-500 ${
              hasRoutineToday 
                ? 'text-[#3a6b4d] fill-[#3a6b4d]' 
                : 'text-gray-400 fill-transparent' 
            }`} 
          />
        </motion.div>

        {/* Textos */}
        <div className="flex-1">
          <h2 className="text-[#2f5e42] font-semibold leading-tight font-poppins">
            {streak > 0 
              ? ` ${streak} ${streak === 1 ? 'dia' : 'dias'} de glow ✨` 
              : 'Já fez sua rotina hoje?'}
          </h2>
          <p className="text-[#3a6b4d]/70 text-sm mt-0.5">
            {hasRoutineToday 
              ? `${streak} de ${nextGoal} dias concluídos` 
              : 'Registre e não perca sua constância.'}
          </p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mt-5 w-full h-2.5 bg-[#8ec5a0]/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full transition-colors duration-500 ${
            hasRoutineToday 
              ? 'bg-gradient-to-r from-[#cbe4d4] via-[#8ec5a0] via-65% to-[#3a6b4d]'
              : 'bg-gray-300' 
          }`}
        />
      </div>
    </motion.div>
  )
}