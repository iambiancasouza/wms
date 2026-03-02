'use client'

import { X, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RoutineHistoryModalProps {
  date: Date;
  onCloseAction: () => void;
  // Futuramente você passará a rotina buscada do banco aqui: routineData: any
}

export function RoutineHistoryModal({ date, onCloseAction }: RoutineHistoryModalProps) {
  return (
    <>
      {/* Overlay escuro de fundo */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] animate-in fade-in duration-300" 
        onClick={onCloseAction}
      />
      
      {/* Caixa Subindo (Bottom Sheet) */}
      <div className="fixed bottom-0 left-0 right-0 z-[120] bg-[#f0f5ed] rounded-t-[40px] shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[85vh] overflow-y-auto no-scrollbar">
        
        {/* Tracinho no topo (Puxador mobile) */}
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="p-8 pt-4 pb-24 space-y-8 max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#3a6b4d] font-poppins tracking-tight">
                Minha rotina de:
              </h2>
              <p className="text-[#3a6b4d]/70 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#8ec5a0]" />
                {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </p>
            </div>
            <button 
              onClick={onCloseAction} 
              className="p-3 bg-white/70 backdrop-blur-sm rounded-full text-gray-400 border border-white hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área onde os produtos daquele dia vão aparecer */}
          <div className="bg-white/50 border border-white/80 p-8 rounded-[32px] text-center w-full min-h-[200px] flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm font-medium">
              Aqui aparecerão os produtos que você usou no dia {format(date, "dd/MM")}.
            </p>
            <p className="text-[#3a6b4d]/40 text-xs mt-2 italic">
              (Conectaremos ao Supabase no próximo passo)
            </p>
          </div>

        </div>
      </div>
    </>
  )
}