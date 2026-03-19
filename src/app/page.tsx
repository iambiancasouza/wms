'use client'

import { useState } from 'react'
import { MobileHeader } from '@/components/headerMobile/MobileHeader'

import { Hero } from '@/components/home/Hero'
import { RoutineDashboard } from '@/components/home/RoutineDashboard'
import { JournalingModal } from '@/components/modals/JournalingModal'
import { RoutineHistoryModal } from '@/components/modals/RoutineHistoryModal'
import { useHomeData } from '@/hooks/useHomeData'
import { Product } from '@/types/db'
import { format } from 'date-fns'

export default function Home() {
  const { routines, completedDates, allProducts, refresh } = useHomeData()

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const todayRoutines = routines.filter(r => r.routine_date === todayStr)

  const [journalingConfig, setJournalingConfig] = useState<{
    period: 'diurna' | 'noturna' | null
    targetDate?: Date
    initialProducts?: Product[]
    routineId?: string
  }>({ period: null })

  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(
    null
  )

  const handleOpenJournalingAction = (period: 'diurna' | 'noturna') => {
    const existingRoutine = todayRoutines.find(r => r.period === period)

    setJournalingConfig({
      period,
      targetDate: today,
      initialProducts:
        (existingRoutine?.products as unknown as Product[]) || [],
      routineId: existingRoutine?.id
    })
  }

  const handleNavigateJournalingDate = (newDate: Date) => {
    if (!journalingConfig.period) return
    const dateStr = format(newDate, 'yyyy-MM-dd')
    const existingRoutine = routines.find(
      r => r.routine_date === dateStr && r.period === journalingConfig.period
    )

    setJournalingConfig({
      period: journalingConfig.period,
      targetDate: newDate,
      initialProducts:
        (existingRoutine?.products as unknown as Product[]) || [],
      routineId: existingRoutine?.id
    })
  }

  const handleEditRoutineAction = (
    period: 'diurna' | 'noturna',
    products: Product[],
    routineId?: string,
    editDate?: Date
  ) => {
    const dateToEdit = editDate || selectedHistoryDate
    if (!dateToEdit) return

    setSelectedHistoryDate(null)

    setJournalingConfig({
      period,
      targetDate: dateToEdit,
      initialProducts: products,
      routineId
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
          <RoutineDashboard
            completedDates={completedDates}
            todayRoutines={todayRoutines}
            onOpenJournalingAction={handleOpenJournalingAction}
            onOpenDayDetailsAction={date => setSelectedHistoryDate(date)}
            // isLoading={loading} / prop para o componente no futuro/
          />
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
