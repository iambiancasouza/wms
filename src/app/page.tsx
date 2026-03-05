'use client'

import { useState } from 'react'
import { Hero } from '@/components/home/Hero'
import { RoutineDashboard } from '@/components/home/RoutineDashboard'
import { JournalingModal } from '@/components/collection/modals/JournalingModal'
import { RoutineHistoryModal } from '@/components/collection/modals/RoutineHistoryModal' 
import { useHomeData } from '@/hooks/useHomeData'
import { Product } from '@/types/product'

export default function Home() {
  const { completedDates, allProducts, loading, refresh } = useHomeData()
  
  const [journalingConfig, setJournalingConfig] = useState<{
    period: 'diurna' | 'noturna' | null;
    targetDate?: Date;
    initialProducts?: Product[];
  }>({ period: null })

  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(null) 

  const handleOpenJournalingAction = (period: 'diurna' | 'noturna') => {
    setJournalingConfig({ 
      period, 
      targetDate: new Date(), 
      initialProducts: []     
    })
  }

  const handleEditRoutineAction = (period: 'diurna' | 'noturna', products: Product[]) => {
    if (!selectedHistoryDate) return;
    const dateToEdit = selectedHistoryDate;
    setSelectedHistoryDate(null);
    
    setJournalingConfig({
      period,
      targetDate: dateToEdit, 
      initialProducts: products 
    });
  }

  const handleCloseJournalingAction = () => {
    setJournalingConfig({ period: null })
    refresh()
  }

  return (
    <main className="w-full min-h-[100dvh] bg-[#f0f5ed]">
      <Hero />
      
      {!loading && (
        <RoutineDashboard
          completedDates={completedDates}
          onOpenJournalingAction={handleOpenJournalingAction}
          onOpenDayDetailsAction={(date) => setSelectedHistoryDate(date)} 
        />
      )}

      {journalingConfig.period && (
        <JournalingModal
          period={journalingConfig.period}
          products={allProducts}
          onCloseAction={handleCloseJournalingAction}
          targetDate={journalingConfig.targetDate}
          initialSelectedProducts={journalingConfig.initialProducts}
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