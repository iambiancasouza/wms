'use client'

import { useState, useMemo } from 'react'
import { useHomeData } from '@/providers/HomeDataProvider'
import { motion } from 'framer-motion'
import { StreakCard } from '@/components/routines/StreakCard'
import { ViewToggle } from '@/components/routines/ViewToggle'
import { RoutineTimeline } from '@/components/routines/RoutineTimeline'
import { RoutineCalendar } from '@/components/routines/RoutineCalendar' 
import { RoutineHistoryModal } from '@/components/modals/RoutineHistoryModal' 
// import { Product } from '@/types/db'

type ViewMode = 'timeline' | 'calendar'

export default function RotinasPage() {
  const { routines, loading, products } = useHomeData()
  const [view, setView] = useState<ViewMode>('timeline')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null) 

  // Calcula as datas concluídas para passar para o calendário
  const completedDates = useMemo(() => {
    if (!routines) return []

    const uniqueDatesStr = Array.from(
      new Set(routines.filter(r => r.routine_date).map(r => r.routine_date as string))
    )
    return uniqueDatesStr.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    })
  }, [routines])

  // const handleOpenDayDetails = (date: Date) => {
    // setSelectedDate(date)
  // }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1.5, y: 0 }}
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
        
        <ViewToggle currentView={view} onViewChange={setView} />
      
        <section className="flex-1 w-full mt-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#8ec5a0]/30 border-t-[#3a6b4d] rounded-full animate-spin" />
            </div>
          ) : view === 'timeline' ? (
            <RoutineTimeline routines={routines} />
          ) : (
            <RoutineCalendar 
              completedDates={completedDates}
              // onOpenDayDetailsAction={handleOpenDayDetails}
            />
          )}
        </section>
      </motion.div>

      {selectedDate && (
        <RoutineHistoryModal 
          date={selectedDate}
          onCloseAction={() => setSelectedDate(null)}
          allProducts={products || []} 
          readOnly={true}
        />
      )}
    </>
  )
}