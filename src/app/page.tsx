'use client'

import { useState } from 'react'
import { MobileHeader } from '@/components/headerMobile/MobileHeader'

import { Hero } from '@/components/home/Hero'
import { RoutineDashboard } from '@/components/home/RoutineDashboard'
import { RoutineDashboardSkeleton } from '@/components/home/RoutineDashboardSkeleton'
import { JournalingModal } from '@/components/modals/JournalingModal'
import { RoutineHistoryModal } from '@/components/modals/RoutineHistoryModal'
import { HomeDataProvider, useHomeData } from '@/providers/HomeDataProvider'
import { useTodayLocal } from '@/hooks/useTodayLocal'
import { Product } from '@/types/db'
import { formatDateKey } from '@/lib/date'

function HomeContent() {
  const { routines, completedDates, allProducts, refresh, loading } = useHomeData()
  const { today, todayKey } = useTodayLocal()
  const todayStr = todayKey
  const todayRoutines = routines.filter(r => r.routine_date === todayStr)

  const [journalingConfig, setJournalingConfig] = useState<{
    period: 'diurna' | 'noturna' | null
    targetDate?: Date
    initialProducts?: Product[]
    routineId?: string
    initialNotes?: string
  }>({ period: null })

  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(
    null
  )

  const handleOpenJournalingAction = (period: 'diurna' | 'noturna') => {
    if (!today) return

    const existingRoutine = todayRoutines.find(r => r.period === period)

    setJournalingConfig({
      period,
      targetDate: today,
      initialProducts:
        (existingRoutine?.products as unknown as Product[]) || [],
      routineId: existingRoutine?.id,
      initialNotes: existingRoutine?.notes || ''
    })
  }

  const handleNavigateJournalingDate = (newDate: Date) => {
    if (!journalingConfig.period) return
    const dateStr = formatDateKey(newDate)
    const existingRoutine = routines.find(
      r => r.routine_date === dateStr && r.period === journalingConfig.period
    )

    setJournalingConfig({
      period: journalingConfig.period,
      targetDate: newDate,
      initialProducts:
        (existingRoutine?.products as unknown as Product[]) || [],
      routineId: existingRoutine?.id,
      initialNotes: existingRoutine?.notes || ''
    })
  }

  const handleEditRoutineAction = (
    period: 'diurna' | 'noturna',
    products: Product[],
    routineId?: string,
    editDate?: Date,
    notes?: string | null
  ) => {
    const dateToEdit = editDate || selectedHistoryDate
    if (!dateToEdit) return

    setSelectedHistoryDate(null)

    setJournalingConfig({
      period,
      targetDate: dateToEdit,
      initialProducts: products,
      routineId,
      initialNotes: notes || ''
    })
  }

  const handleCloseJournalingAction = () => {
    setJournalingConfig({ period: null })
    refresh()
  }

  return (
    <main className="bg-[#f0f5ed] min-h-[100dvh]">
      <MobileHeader />
      <Hero />
      <div className="relative w-full min-h-[50vh]">
        <div className="relative z-10">
          {loading || !today ? (
            <RoutineDashboardSkeleton />
          ) : (
            <RoutineDashboard
              key={todayKey}
              today={today}
              todayKey={todayKey}
              completedDates={completedDates}
              todayRoutines={todayRoutines}
              onOpenJournalingAction={handleOpenJournalingAction}
              onOpenDayDetailsAction={date => setSelectedHistoryDate(date)}
              // isLoading={loading} / prop para o componente no futuro/
            />
          )}
        </div>
      </div>

      {journalingConfig.period && (
        <JournalingModal
          period={journalingConfig.period}
          products={allProducts}
          onCloseAction={handleCloseJournalingAction}
          targetDate={journalingConfig.targetDate}
          initialSelectedProducts={journalingConfig.initialProducts}
          routineId={journalingConfig.routineId}
          initialNotes={journalingConfig.initialNotes}
          onNavigateDateAction={handleNavigateJournalingDate}
        />
      )}

      {selectedHistoryDate && (
        <RoutineHistoryModal
          date={selectedHistoryDate}
          onCloseAction={() => setSelectedHistoryDate(null)}
          onEditAction={handleEditRoutineAction}
          allProducts={allProducts}
        />
      )}
    </main>
  )
}

export default function Home() {
  return (
    <HomeDataProvider>
      <HomeContent />
    </HomeDataProvider>
  )
}
