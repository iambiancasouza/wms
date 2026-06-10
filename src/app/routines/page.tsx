'use client'

import { useState, useMemo } from 'react'
import { HomeDataProvider, useHomeData } from '@/providers/HomeDataProvider'
import { motion } from 'framer-motion'
import { StreakCard } from '@/components/routines/StreakCard'
import { ViewToggle } from '@/components/routines/ViewToggle'
import { RoutineTimeline } from '@/components/routines/RoutineTimeline'
import { RoutineCalendar } from '@/components/routines/RoutineCalendar'
import { RoutinesPageSkeleton } from '@/components/routines/RoutinesPageSkeleton'
import { RoutineHistoryModal } from '@/components/modals/RoutineHistoryModal'
import { JournalingModal } from '@/components/modals/JournalingModal'
import { Product, Routine } from '@/types/db'
import { normalizeDateKey } from '@/lib/date'
import { useTodayLocal } from '@/hooks/useTodayLocal'

type ViewMode = 'timeline' | 'calendar'

interface JournalingConfig {
  period: 'diurna' | 'noturna'
  targetDate: Date
  initialProducts?: Product[]
  routineId?: string
  initialNotes?: string
}

function RoutinesContent() {
  const { routines, loading, products, allProducts, refresh } = useHomeData()
  const { today, todayKey } = useTodayLocal()
  const [view, setView] = useState<ViewMode>('timeline')
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(null)
  const [journalingConfig, setJournalingConfig] = useState<JournalingConfig | null>(null)

  const completedDates = useMemo(() => {
    if (!routines) return []
    return routines
      .filter(r => r.routine_date)
      .map(r => normalizeDateKey(r.routine_date as string))
  }, [routines])

  if (loading || !today) {
    return <RoutinesPageSkeleton />
  }

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
      initialProducts: productsToRepeat,
      initialNotes: (routine.notes as string | null) || ''
    })
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen px-5 pt-8 pb-20 flex flex-col gap-6"
      >
        <header className="z-10">
          <h1 className="text-xl md:text-2xl font-bold text-[#3a6b4d] font-poppins tracking-tight">
            Histórico
          </h1>
          <p className="text-[#3a6b4d]/70 text-sm mt-1">
            Sua jornada de autocuidado.
          </p>
        </header>

        <StreakCard routines={routines} />
        <ViewToggle currentView={view} onViewChange={setView} />

        <section className="flex-1 w-full mt-2">
          {view === 'timeline' ? (
            <RoutineTimeline
              routines={routines}
              onRepeatAction={handleRepeatRoutine}
            />
          ) : (
            <RoutineCalendar
              key={todayKey}
              today={today}
              todayKey={todayKey}
              completedDates={completedDates}
              onOpenDayDetailsAction={date => setSelectedHistoryDate(date)}
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
          initialNotes={journalingConfig.initialNotes}
          products={products || allProducts || []}
          onCloseAction={() => setJournalingConfig(null)}
          onSavedAction={() => refresh({ force: true })}
          onNavigateDateAction={date =>
            setJournalingConfig(prev => (prev ? { ...prev, targetDate: date } : null))
          }
        />
      )}
    </>
  )
}

export default function RotinasPage() {
  return (
    <HomeDataProvider>
      <RoutinesContent />
    </HomeDataProvider>
  )
}
