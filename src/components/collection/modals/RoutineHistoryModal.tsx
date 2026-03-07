'use client'

import Image from 'next/image'
import { X, CalendarDays, Sun, Moon, Loader2, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRoutineHistory } from '@/hooks/useRoutineHistory'
import { Product } from '@/types/product'
import { RoutineRecord } from '@/types/routine'
import { StaticLeaves } from '@/components/layout/staticLeaves'

interface RoutineHistoryModalProps {
  date: Date
  onCloseAction: () => void
  onEditAction: (period: 'diurna' | 'noturna', products: Product[], routineId?: string) => void
  allProducts: Product[]
}

export function RoutineHistoryModal({
  date,
  onCloseAction,
  onEditAction,
  allProducts
}: RoutineHistoryModalProps) {
  const { routines, loading } = useRoutineHistory(date)

  const rotinaDiurna = routines.find(
    (r: RoutineRecord) => r.period === 'diurna'
  )
  const rotinaNoturna = routines.find(
    (r: RoutineRecord) => r.period === 'noturna'
  )

  const diurnaProducts = rotinaDiurna?.products || []
  const noturnaProducts = rotinaNoturna?.products || []

  return (
    <div className="fixed inset-0 z-[120] bg-[#f0f5ed] animate-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar">
      <div className="fixed inset-0 pointer-events-none z-0">
        <StaticLeaves />
      </div>

      <div className="relative z-10 w-full min-h-full p-4 md:p-6 py-6 md:py-10">
        <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[40px] p-6 md:p-8 space-y-8 flex flex-col h-auto min-h-[80vh]">
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#1e3c2c] uppercase tracking-widest">
                Rotina de:
              </h2>
              <p className="text-[#5f8c73] text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </p>
            </div>
            <button
              onClick={onCloseAction}
              className="p-2.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-400 border border-white hover:text-[#1e3c2c] active:scale-95 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-8 h-8 text-[#5f8c73] animate-spin" />
              <p className="text-sm font-bold text-[#5f8c73]/60 tracking-widest uppercase">
                Buscando registros...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* CARD DIURNA - SEMPRE VISÍVEL */}
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fdeee4] to-[#f4d7c3] flex items-center justify-center text-[#c78255]">
                      <Sun className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-gray-800 tracking-wide">
                      Rotina da Manhã
                    </h3>
                  </div>
                  <button 
                    // NOVO: Passando o rotinaDiurna.id garantindo atualização precisa
                    onClick={() => onEditAction('diurna', diurnaProducts, rotinaDiurna?.id)}
                    className="p-2 text-gray-400 hover:text-[#c78255] transition-colors rounded-full hover:bg-orange-50 active:scale-95"
                    title={diurnaProducts.length > 0 ? "Editar Rotina da Manhã" : "Adicionar Rotina da Manhã"}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {diurnaProducts.length > 0 ? (
                    diurnaProducts.map((item: Product) => {
                      const freshProduct = (allProducts || []).find(p => p.id === item.id) || item;

                      return (
                        <div
                          key={freshProduct.id}
                          className="relative flex flex-col items-center justify-center rounded-full shadow-sm border border-[#8ec5a0]/30 w-[100px] h-[100px] overflow-hidden shrink-0 animate-in zoom-in bg-[#eef4f0]"
                        >
                          {freshProduct.image_url ? (
                            <Image 
                              src={freshProduct.image_url} 
                              alt={freshProduct.name} 
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-2">
                              <span className="text-[8px] font-black text-[#5a9e74] uppercase tracking-wider truncate w-full">
                                {freshProduct.brand}
                              </span>
                              <span className="text-[10px] font-bold text-[#1e3c2c] leading-tight line-clamp-2 w-full mt-0.5">
                                {freshProduct.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400 w-full text-center">
                      <p className="text-sm font-medium">Nenhum produto registrado.</p>
                      <p className="text-[10px] mt-1 tracking-wide uppercase text-gray-300">Clique no lápis para adicionar</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD NOTURNA - SEMPRE VISÍVEL */}
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f0f2fb] to-[#e1e6f7] flex items-center justify-center text-[#8695c5]">
                      <Moon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-gray-800 tracking-wide">
                      Rotina da Noite
                    </h3>
                  </div>
                  <button 
                    // NOVO: Passando o rotinaNoturna.id garantindo atualização precisa
                    onClick={() => onEditAction('noturna', noturnaProducts, rotinaNoturna?.id)}
                    className="p-2 text-gray-400 hover:text-[#8695c5] transition-colors rounded-full hover:bg-indigo-50 active:scale-95"
                    title={noturnaProducts.length > 0 ? "Editar Rotina da Noite" : "Adicionar Rotina da Noite"}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {noturnaProducts.length > 0 ? (
                    noturnaProducts.map((item: Product) => {
                      const freshProduct = (allProducts || []).find(p => p.id === item.id) || item;

                      return (
                        <div
                          key={freshProduct.id}
                          className="relative flex flex-col items-center justify-center rounded-full shadow-sm border border-[#8ec5a0]/30 w-[100px] h-[100px] overflow-hidden shrink-0 animate-in zoom-in bg-[#eef4f0]"
                        >
                          {freshProduct.image_url ? (
                            <Image 
                              src={freshProduct.image_url} 
                              alt={freshProduct.name} 
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-2">
                              <span className="text-[8px] font-black text-[#5a9e74] uppercase tracking-wider truncate w-full">
                                {freshProduct.brand}
                              </span>
                              <span className="text-[10px] font-bold text-[#1e3c2c] leading-tight line-clamp-2 w-full mt-0.5">
                                {freshProduct.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400 w-full text-center">
                      <p className="text-sm font-medium">Nenhum produto registrado.</p>
                      <p className="text-[10px] mt-1 tracking-wide uppercase text-gray-300">Clique no lápis para adicionar</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}