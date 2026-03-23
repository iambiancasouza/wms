'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RoutineCalendarProps {
  completedDates: Date[]
  // onOpenDayDetailsAction: (date: Date) => void
}

export function RoutineCalendar({
  completedDates,
  // onOpenDayDetailsAction
}: RoutineCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayIndex = getDay(monthStart)
  const emptyDays = Array.from({ length: startDayIndex }, (_, i) => i)

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl rounded-[32px] p-4 md:p-6 border-2 border-white/30 shadow-xl shadow-[#3a6b4d]/5">
      {/* Cabeçalho do Calendário (Mês e Setas) */}
      <div className="flex justify-between items-center mb-5 px-1">
        <button
          onClick={prevMonth}
          className="p-2 text-gray-400 hover:text-[#3a6b4d] transition-colors rounded-full hover:bg-white/50 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-[#3a6b4d] uppercase tracking-widest text-sm">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 text-gray-400 hover:text-[#3a6b4d] transition-colors rounded-full hover:bg-white/50 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Grade de Dias */}
      <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
        {/* Dias da Semana */}
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <span
            key={`header-${i}`}
            className="text-xs font-black text-[#3a6b4d]/60 mb-2"
          >
            {d}
          </span>
        ))}

        {/* Espaços vazios do início do mês */}
        {emptyDays.map(empty => (
          <div key={`empty-${empty}`} />
        ))}

        {/* Dias do Mês */}
        {daysInMonth.map(day => {
          const isToday = isSameDay(day, today)
          const hasRoutine = completedDates.some(d => isSameDay(d, day))

          return (
            <div
              key={day.toString()}
              className="relative flex flex-col items-center justify-center h-10"
            >
              <button
                // onClick={() => hasRoutine && onOpenDayDetailsAction(day)}
                disabled={!hasRoutine && !isToday}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all
                  ${
                    isToday
                      ? 'bg-[#3a6b4d]/70 text-white shadow-md'
                      : hasRoutine
                        ? 'text-gray-400 cursor-pointer bg-[#3a6b4d]/10 active:scale-95'
                        : 'text-gray-500 cursor-default opacity-50'
                  } 
                `}
              >
                {format(day, 'd')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
