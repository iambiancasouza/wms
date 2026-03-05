'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Plus, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSaveRoutine } from '@/hooks/useSaveRoutine'
import { Product } from '@/types/product'
import { StaticLeaves } from '@/components/layout/staticLeaves'

const formatDayOfWeek = (date: Date) => {
  const day = format(date, 'EEEE', { locale: ptBR })
  return day.charAt(0).toUpperCase() + day.slice(1)
}

const Categories = [
  { id: 'limpeza', label: 'Limpeza' },
  { id: 'tonico', label: 'Toner/Essence' },
  { id: 'antioxidante', label: 'Antioxidante' },
  { id: 'barreira', label: 'Barreira/Reparador' },
  { id: 'hidratacao', label: 'Hidratação' },
  { id: 'protecao', label: 'Proteção' },
  { id: 'olhos', label: 'Área dos Olhos' },
  { id: 'tratamento', label: 'Tratamento' },
  { id: 'outros', label: 'Outros' }
]

interface JournalingModalProps {
  period: 'diurna' | 'noturna'
  onCloseAction: () => void
  products: Product[]
  initialSelectedProducts?: Product[]
  targetDate?: Date
}

export function JournalingModal({
  period,
  onCloseAction,
  products,
  initialSelectedProducts,
  targetDate
}: JournalingModalProps) {
  const { saveRoutine, isSaving } = useSaveRoutine()

  const [selectedCategory, setSelectedCategory] = useState<string>('limpeza')
  const [routineItems, setRoutineItems] = useState<Product[]>(initialSelectedProducts || [])
  
  const activeDate = targetDate || new Date()
  const isEditingToday = isToday(activeDate)

  const filteredProducts = products.filter(p => p.category === selectedCategory)

  const toggleProductSelection = (product: Product) => {
    setRoutineItems(prev => {
      const isSelected = prev.some(item => item.id === product.id)
      if (isSelected) {
        return prev.filter(item => item.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const handleSave = () => {
    saveRoutine(period, routineItems, activeDate, onCloseAction)
  }

  return (
    <div className="fixed inset-0 z-[110] bg-[#f0f5ed] animate-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar">
      <div className="fixed inset-0 pointer-events-none z-0">
        <StaticLeaves />
      </div>

      <div className="relative z-10 w-full min-h-full p-4 md:p-6 py-6 md:py-10">
        <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[40px] p-6 md:p-8 space-y-8 flex flex-col h-auto min-h-[85vh]">
          
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h2 className="text-3xl font-bold text-[#3a6b4d] font-poppins tracking-tight">
                {isEditingToday ? 'Rotina de hoje' : 'Editar rotina'}
              </h2>
              <p className="text-[#3a6b4d]/70 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span>{formatDayOfWeek(activeDate)}</span>,
                <span>{format(activeDate, 'dd')}</span>
                <span>DE</span>
                <span>{format(activeDate, 'MMMM', { locale: ptBR })}</span>
              </p>
            </div>
            <button
              onClick={onCloseAction}
              className="p-3 bg-white/70 backdrop-blur-sm rounded-full text-gray-400 border border-white hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {Categories.map(cat => {
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-3 rounded-full text-xs font-bold border transition-all whitespace-nowrap active:scale-95
                      ${
                        isSelected
                          ? 'bg-[#3a6b4d] border-[#3a6b4d] text-white hover:border-gray-200 shadow-sm'
                          : 'bg-transparent border-[#8ec5a0] text-[#3a6b4d] shadow-inner font-black'
                      }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[#3a6b4d]/40 uppercase tracking-[0.2em] pl-1">
              Selecione seus produtos
            </h4>

            <div className="flex flex-wrap gap-3 items-center">
              {filteredProducts.length === 0 ? (
                <div className="bg-white/60 border border-white/80 p-6 rounded-2xl text-center w-full">
                  <p className="text-gray-400 text-sm">
                    Nenhum produto cadastrado nesta categoria.
                  </p>
                </div>
              ) : (
                filteredProducts.map((p: Product) => {
                  const isItemInRoutine = routineItems.some(item => item.id === p.id)
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleProductSelection(p)}
                      className={`inline-flex items-center gap-3 px-2.5 py-2 rounded-xl border shadow-md transition-all active:scale-95
                        ${
                          isItemInRoutine
                            ? 'bg-[#3a6b4d]/10 border-[#3a6b4d]/30 text-[#3a6b4d]'
                            : 'bg-white/10 border-white text-gray-700 hover:border-gray-100'
                        }`}
                    >
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-[9px] font-bold text-[#3a6b4d]/60 uppercase tracking-widest truncate">
                          {p.brand}
                        </span>
                        <p className="font-bold text-xs truncate max-w-[150px]">
                          {p.name}
                        </p>
                      </div>
                      {isItemInRoutine ? (
                        <Check className="w-4 h-4 text-[#3a6b4d]" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h4 className="text-[10px] font-black text-[#3a6b4d]/40 uppercase tracking-[0.2em] pl-1">
              Sua Caixa de Rotina
            </h4>

            <div className="bg-[#f0f5ed]/30 border-2 border-dashed border-[#8ec5a0] rounded-[32px] p-5 min-h-[160px] flex flex-col shadow-inner w-full">
              
              <div className="flex flex-wrap justify-center gap-4 w-full">
                {routineItems.length === 0 ? (
                  <div className="text-center w-full mt-6 text-gray-400">
                    <p className="text-sm">Sua caixa está vazia.</p>
                  </div>
                ) : (
                  routineItems.map((item: Product) => (
                    <button
                      key={item.id}
                      onClick={() => toggleProductSelection(item)}
                      title="Clique para remover"
                      className="relative flex flex-col items-center justify-center rounded-full shadow-sm border border-[#8ec5a0]/30 w-[100px] h-[100px] overflow-hidden shrink-0 animate-in zoom-in bg-[#eef4f0] hover:opacity-80 transition-opacity active:scale-95"
                    >
                      {item.image_url ? (
                        <Image 
                          src={item.image_url} 
                          alt={item.name} 
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-2">
                          <span className="text-[8px] font-black text-[#5a9e74] uppercase tracking-wider truncate w-full">
                            {item.brand}
                          </span>
                          <span className="text-[10px] font-bold text-[#1e3c2c] leading-tight line-clamp-2 w-full mt-0.5">
                            {item.name}
                          </span>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              {routineItems.length > 0 && (
                <p className="text-[10px] text-[#5a9e74]/70 text-center mt-auto pt-6 font-medium tracking-wide">
                  Para remover um produto, basta clicar sobre ele.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 w-full mt-auto">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-16 bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-2xl font-bold text-lg shadow-2xl shadow-[#3a6b4d]/20 flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-70"
            >
              {isSaving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Salvar Rotina
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}