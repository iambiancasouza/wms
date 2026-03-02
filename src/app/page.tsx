'use client'

import { useState } from 'react'
import { Hero } from '@/components/home/Hero'
import { RoutineDashboard } from '@/components/home/RoutineDashboard'
import { JournalingModal } from '@/components/collection/modals/JournalingModal'
import { RoutineHistoryModal } from '@/components/collection/modals/RoutineHistoryModal' // <-- Import do novo modal
import { useHomeData } from '@/hooks/useHomeData'

export default function Home() {
  const { completedDates, allProducts, loading, refresh } = useHomeData()
  
  // Estados para controlar qual modal está aberto
  const [journalingPeriod, setJournalingPeriod] = useState<
    'diurna' | 'noturna' | null
  >(null)
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(null) // <-- Novo estado para o calendário

  const handleOpenJournalingAction = (period: 'diurna' | 'noturna') => {
    setJournalingPeriod(period)
  }

  const handleCloseJournalingAction = () => {
    setJournalingPeriod(null)
    refresh()
  }

  return (
    <main className="w-full min-h-screen bg-[#f0f5ed]">
      <Hero />
      
      {!loading && (
        <RoutineDashboard
          completedDates={completedDates}
          onOpenJournalingAction={handleOpenJournalingAction}
          onOpenDayDetailsAction={(date) => setSelectedHistoryDate(date)} // <-- Ação que passa a data clicada
        />
      )}

      {/* Modal para registar a rotina do dia atual */}
      {journalingPeriod && (
        <JournalingModal
          period={journalingPeriod}
          products={allProducts}
          onCloseAction={handleCloseJournalingAction}
        />
      )}

      {/* Modal que sobe mostrando o histórico do dia selecionado no calendário */}
      {selectedHistoryDate && (
        <RoutineHistoryModal 
          date={selectedHistoryDate} 
          onCloseAction={() => setSelectedHistoryDate(null)} 
        />
      )}
    </main>
  )
}