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
  
  // Estado completo que gerencia todo o ciclo de vida de Criação e Edição
  const [journalingConfig, setJournalingConfig] = useState<{
    period: 'diurna' | 'noturna' | null;
    targetDate?: Date;
    initialProducts?: Product[];
    routineId?: string; 
  }>({ period: null })

  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(null) 

  // Ação de Criar (Vem do Dashboard)
  const handleOpenJournalingAction = (period: 'diurna' | 'noturna') => {
    setJournalingConfig({ 
      period, 
      targetDate: new Date(), 
      initialProducts: [],
      routineId: undefined
    })
  }

  // Ação de Editar (Vem do RoutineHistoryModal)
  const handleEditRoutineAction = (period: 'diurna' | 'noturna', products: Product[], routineId?: string) => {
    if (!selectedHistoryDate) return;
    const dateToEdit = selectedHistoryDate;
    
    // Fecha o modal de histórico
    setSelectedHistoryDate(null);
    
    // Abre o modal de edição passando o ID exato para o banco de dados
    setJournalingConfig({
      period,
      targetDate: dateToEdit, 
      initialProducts: products,
      routineId: routineId 
    });
  }

  // Ao fechar, limpa o estado e manda a página atualizar (refresh) os dados do Supabase
  const handleCloseJournalingAction = () => {
    setJournalingConfig({ period: null })
    refresh()
  }

  return (
    <main className="bg-[#f0f5ed] min-h-[100dvh]">
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
          routineId={journalingConfig.routineId}
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