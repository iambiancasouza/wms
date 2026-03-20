'use client'

import { CalendarDays, ListTree } from 'lucide-react'

type ViewMode = 'timeline' | 'calendar'

interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex justify-center w-full my-2">
      <div className="bg-white/40 p-1 rounded-full flex items-center gap-1 backdrop-blur-md border border-[#8ec5a0]/30 shadow-sm">
        
        {/* Botão Calendário */}
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            currentView === 'calendar'
              ? 'bg-[#3a6b4d]/75 text-white shadow-md'
              : 'text-[#3a6b4d]/70 hover:text-[#3a6b4d] hover:bg-[#8ec5a0]/10'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Calendário
        </button>

        {/* Botão Linha do Tempo */}
        <button
          onClick={() => onViewChange('timeline')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            currentView === 'timeline'
              ? 'bg-[#3a6b4d]/75 text-white shadow-md'
              : 'text-[#3a6b4d]/70 hover:text-[#3a6b4d] hover:bg-[#8ec5a0]/10'
          }`}
        >
          <ListTree className="w-4 h-4" />
          Linha do Tempo
        </button>
        
      </div>
    </div>
  )
}