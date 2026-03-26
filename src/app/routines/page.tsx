'use client'

import { useState, useMemo } from 'react'
import { useHomeData } from '@/providers/HomeDataProvider'
import { motion } from 'framer-motion'
import { StreakCard } from '@/components/routines/StreakCard'
import { ViewToggle } from '@/components/routines/ViewToggle'
import { RoutineTimeline } from '@/components/routines/RoutineTimeline'
import { RoutineCalendar } from '@/components/routines/RoutineCalendar' 
import { RoutineHistoryModal } from '@/components/modals/RoutineHistoryModal'
import { JournalingModal } from '@/components/modals/JournalingModal'
import { Product, Routine } from '@/types/db'

type ViewMode = 'timeline' | 'calendar'

interface JournalingConfig {
  period: 'diurna' | 'noturna'
  targetDate: Date
  initialProducts?: Product[]
  routineId?: string
}

export default function RotinasPage() {
  const { routines, loading, products, allProducts } = useHomeData()
  const [view, setView] = useState<ViewMode>('timeline')
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(null)
  const [journalingConfig, setJournalingConfig] = useState<JournalingConfig | null>(null)

  const completedDates = useMemo(() => {
    if (!routines) return []
    return routines
      .filter(r => r.routine_date)
      .map(r => {
        const [year, month, day] = (r.routine_date as string).split('-').map(Number)
        return new Date(year, month - 1, day)
      })
  }, [routines])

  const handleRepeatRoutine = (routine: Routine) => {
    const productsToRepeat = Array.isArray(routine.products)
      ? (routine.products as unknown as Product[])
      : typeof routine.products === 'string'
        ? JSON.parse(routine.products)
        : []

    setSelectedHistoryDate(null) 
    setJournalingConfig({
      period: routine.period as 'diurna' | 'noturna',
      targetDate: new Date(), 
      initialProducts: productsToRepeat
    })
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen px-5 pt-6 pb-24 flex flex-col gap-6"
      >
        <header className="z-10">
          <h1 className="text-2xl font-bold text-[#2f5e42] font-poppins">Histórico</h1>
          <p className="text-[#3a6b4d]/70 text-sm mt-1">Sua jornada de autocuidado.</p>
        </header>

        <StreakCard routines={routines} /> 
        <ViewToggle currentView={view} onViewChange={setView} />
      
        <section className="flex-1 w-full mt-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#8ec5a0]/30 border-t-[#3a6b4d] rounded-full animate-spin" />
            </div>
          ) : view === 'timeline' ? (
            <RoutineTimeline routines={routines} onRepeatAction={handleRepeatRoutine} />
          ) : (
            <RoutineCalendar 
              completedDates={completedDates}
              onOpenDayDetailsAction={(date) => setSelectedHistoryDate(date)} 
            />
          )}
        </section>
      </motion.div>

      {selectedHistoryDate && (
        <RoutineHistoryModal 
          date={selectedHistoryDate}
          allProducts={allProducts || products || []}
          onCloseAction={() => setSelectedHistoryDate(null)}
          readOnly={true}
          />
      )}

      {journalingConfig && (
        <JournalingModal
          period={journalingConfig.period}
          targetDate={journalingConfig.targetDate}
          initialSelectedProducts={journalingConfig.initialProducts}
          routineId={journalingConfig.routineId}
          products={products || allProducts || []}
          onCloseAction={() => setJournalingConfig(null)}
          onNavigateDateAction={(date) => setJournalingConfig(prev => prev ? { ...prev, targetDate: date } : null)}
        />
      )}
    </>
  )
}