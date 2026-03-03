'use client'

import { X, CalendarDays, Sun, Moon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRoutineHistory, RoutineRecord } from '@/hooks/useRoutineHistory'
import { Product } from '@/types/product'

interface RoutineHistoryModalProps {
  date: Date;
  onCloseAction: () => void;
}

export function RoutineHistoryModal({ date, onCloseAction }: RoutineHistoryModalProps) {
  const { routines, loading } = useRoutineHistory(date)

  const rotinaDiurna = routines.find((r: RoutineRecord) => r.period === 'diurna')
  const rotinaNoturna = routines.find((r: RoutineRecord) => r.period === 'noturna')

  return (
    <div className="fixed inset-0 z-[120] bg-[#f4f7f5] animate-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar">
      
      {/* Container principal ajustado com padding no topo (pt-10) */}
      <div className="p-6 md:p-8 pt-10 pb-24 space-y-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#1e3c2c] uppercase tracking-widest">
              Seu Diário
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

        {/* Estado de Carregamento */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-[#5f8c73] animate-spin" />
            <p className="text-sm font-bold text-[#5f8c73]/60 tracking-widest uppercase">Buscando registros...</p>
          </div>
        ) : routines.length === 0 ? (
          <div className="bg-white/60 border border-white p-8 rounded-[32px] text-center w-full">
            <p className="text-gray-500 text-sm font-medium">Nenhum registro encontrado para este dia.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* CARD DIURNA */}
            {rotinaDiurna && (
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fdeee4] to-[#f4d7c3] flex items-center justify-center text-[#c78255]">
                    <Sun className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-800 tracking-wide">Rotina da Manhã</h3>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {rotinaDiurna.products.map((p: Product) => (
                    <div key={p.id} className="bg-[#f4f7f5] px-4 py-2.5 rounded-2xl border border-gray-100 flex flex-col">
                      <span className="text-[9px] font-black text-[#a0b0a6] uppercase tracking-wider">{p.brand}</span>
                      <span className="text-xs font-bold text-[#1e3c2c]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CARD NOTURNA */}
            {rotinaNoturna && (
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f0f2fb] to-[#e1e6f7] flex items-center justify-center text-[#8695c5]">
                    <Moon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-800 tracking-wide">Rotina da Noite</h3>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {rotinaNoturna.products.map((p: Product) => (
                    <div key={p.id} className="bg-[#f4f7f5] px-4 py-2.5 rounded-2xl border border-gray-100 flex flex-col">
                      <span className="text-[9px] font-black text-[#a0b0a6] uppercase tracking-wider">{p.brand}</span>
                      <span className="text-xs font-bold text-[#1e3c2c]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}