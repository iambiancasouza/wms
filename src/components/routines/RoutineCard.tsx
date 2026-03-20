'use client'

import Image from 'next/image'
import { Sun, Moon, RefreshCcw } from 'lucide-react'
import { Routine, RoutineProduct } from '@/types/db'

interface RoutineCardProps {
  routine: Routine
}

export function RoutineCard({ routine }: RoutineCardProps) {
  const isMorning = routine.period === 'diurna'
  

  const productsList: RoutineProduct[] = Array.isArray(routine.products) 
    ? routine.products 
    : typeof routine.products === 'string' 
      ? JSON.parse(routine.products as string) 
      : []

  const handleRepeatRoutine = () => {
    console.log('Repetir rotina do período:', routine.period, 'Produtos:', productsList)
  }

  return (
    <div className="w-full bg-white/60 backdrop-blur-xl border border-[#8ec5a0]/40 rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isMorning ? (
            <Sun className="w-5 h-5 text-[#eab308] fill-[#eab308]/20" />
          ) : (
            <Moon className="w-5 h-5 text-[#6366f1] fill-[#6366f1]/20" />
          )}
          <h3 className="text-[#2f5e42] font-semibold text-sm capitalize">
            Rotina {routine.period}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 pl-1">
        {productsList.length > 0 ? (
          <>
            <div className="flex -space-x-3">
              {productsList.map((prod, index) => (
                <div 
                  key={prod.id || index}
                  className="relative w-10 h-10 rounded-full bg-[#8ec5a0] border-2 border-white flex items-center justify-center shadow-sm z-10 overflow-hidden"
                  title={prod.name}
                >
                  {prod.image_url ? (
                    <Image 
                      src={prod.image_url} 
                      alt={prod.name || 'Produto da rotina'} 
                      fill
                      sizes="40px"
                      className="object-cover" 
                    />
                  ) : (
                    <span className="text-white font-medium text-xs">
                      {prod.name ? prod.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className="text-xs text-[#3a6b4d]/50 italic">Nenhum produto registrado</span>
        )}
      </div>

      <button 
        onClick={handleRepeatRoutine}
        className="w-full py-2.5 bg-[#3a6b4d]/5 hover:bg-[#3a6b4d]/10 text-[#3a6b4d] font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#3a6b4d]/10 active:scale-[0.98]"
      >
        <RefreshCcw className="w-4 h-4" />
        Repetir esta rotina hoje
      </button>

    </div>
  )
}