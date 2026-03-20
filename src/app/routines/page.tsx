'use client'

import { useState } from 'react'
import { useHomeData } from '@/providers/HomeDataProvider'
import { motion } from 'framer-motion'
import { StreakCard } from '@/components/routines/StreakCard'
import { ViewToggle } from '@/components/routines/ViewToggle'
import { RoutineTimeline } from '@/components/routines/RoutineTimeline'

type ViewMode = 'timeline' | 'calendar'

export default function RotinasPage() {
  const { routines, loading } = useHomeData()
  const [view, setView] = useState<ViewMode>('timeline')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen px-5 pt-6 pb-24 flex flex-col gap-6"
    >
      <header className='z-10'>
        <h1 className="text-2xl font-bold text-[#2f5e42] font-poppins">
          Histórico de Rotinas
        </h1>
        <p className="text-[#3a6b4d]/70 text-sm mt-1">
          Acompanhe sua constância e evolução.
        </p>
      </header>

     
        <StreakCard routines={routines} /> 
      
      {/* <div className="w-full h-24 bg-white/40 backdrop-blur-md border border-[#8ec5a0]/30 rounded-2xl flex items-center justify-center animate-pulse"> */}
        {/* <span className="text-[#3a6b4d]/50 text-sm">Resumo de Constância em breve...</span> */}
      {/* </div> */}

      
        <ViewToggle currentView={view} onViewChange={setView} />
    

      {/* Área Principal: Timeline ou Calendário */}
      <section className="flex-1 w-full mt-2">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#8ec5a0]/30 border-t-[#3a6b4d] rounded-full animate-spin" />
          </div>
        ) : view === 'timeline' ? (
         
          <RoutineTimeline routines={routines} />
        ) : (
          /* <RoutineCalendar routines={routines} /> */
          <div className="w-full h-64 bg-white/40 backdrop-blur-md border border-[#8ec5a0]/30 rounded-2xl flex items-center justify-center border-dashed">
             <span className="text-[#3a6b4d]/50 text-sm">Calendário aparecerá aqui</span>
          </div>
        )}
      </section>
    </motion.div>
  )
}