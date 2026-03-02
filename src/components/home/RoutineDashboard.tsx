// src/components/home/RoutineDashboard.tsx
'use client'

import { useState } from 'react'
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
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

interface RoutineDashboardProps {
  completedDates: Date[]
  onOpenJournalingAction: (period: 'diurna' | 'noturna') => void
  onOpenDayDetailsAction: (date: Date) => void
}

export function RoutineDashboard({
  completedDates,
  onOpenJournalingAction,
  onOpenDayDetailsAction
}: RoutineDashboardProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayIndex = getDay(monthStart)
  const emptyDays = Array.from({ length: startDayIndex }, (_, i) => i)
  const firstRowDays = daysInMonth.slice(0, 7 - startDayIndex)

  return (
    <section className="relative w-full py-8">
      <div className="container mx-auto px-6 relative z-10">
        <h3
          className="text-lg md:text-xl lg:text-2xl font-black text-[#3a6b4d]/60 uppercase tracking-[0.1em] mb-5 text-center"
        >
          Registrar rotina
        </h3>
        <div className="bg-white/40 backdrop-blur-xl rounded-[32px] p-5 md:p-5 border border-white shadow-2xl shadow-[#3a6b4d]/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LADO ESQUERDO: Calendário no Topo, Cards Embaixo */}
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0">
              {/* 1. CALENDÁRIO (1 Linha / Primeira Semana) */}
              <div className="w-full bg-white/40 backdrop-blur-xl rounded-[32px] p-5 md:p-8 border-2 border-white shadow-xl shadow-[#3a6b4d]/5">
                <div className="flex justify-between items-center mb-5 px-2">
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

                <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <span
                      key={`header-${i}`}
                      className="text-[10px] font-black text-[#3a6b4d]/40 mb-2"
                    >
                      {d}
                    </span>
                  ))}

                  {emptyDays.map(empty => (
                    <div key={`empty-${empty}`} />
                  ))}

                  {firstRowDays.map(day => {
                    const isToday = isSameDay(day, today)
                    const hasRoutine = completedDates.some(d =>
                      isSameDay(d, day)
                    )

                    return (
                      <div
                        key={day.toString()}
                        className="relative flex flex-col items-center justify-center h-8"
                      >
                        <button
                          onClick={() =>
                            hasRoutine && onOpenDayDetailsAction(day)
                          }
                          disabled={!hasRoutine && !isToday}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all
                          ${
                            isToday
                              ? 'bg-[#3a6b4d]/80 text-white shadow-md'
                              : hasRoutine
                                ? 'bg-[#3a6b4d]/10 text-gray-500 cursor-pointer hover:bg-[#3a6b4d]/20 active:scale-95'
                                : 'text-gray-500 cursor-default opacity-50 hover:opacity-100'
                          } 
                        `}
                        >
                          {format(day, 'd')}
                        </button>

                        {hasRoutine && !isToday && (
                          <div className="absolute bottom-0 w-1 h-1 bg-[#3a6b4d]/50 rounded-full" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 2. CARDS DIURNA / NOTURNA */}
              <div className="w-full grid grid-cols-2 gap-4">
                <button
                  onClick={() => onOpenJournalingAction('diurna')}
                  className="group h-32 lg:h-[140px] bg-white/40 backdrop-blur-xl rounded-[32px] border-2 border-white shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 group-hover:bg-orange-100 transition-colors">
                    <Sun className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-500 text-sm">
                    Diurna
                  </span>
                </button>

                <button
                  onClick={() => onOpenJournalingAction('noturna')}
                  className="group h-32 lg:h-[140px] bg-white/40 backdrop-blur-xl rounded-[32px] border-2 border-white shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-100 transition-colors">
                    <Moon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-500 text-sm">
                    Noturna
                  </span>
                </button>
              </div>
            </div>

            {/* LADO DIREITO: Totalmente vazio (reservado para implementações futuras) */}
            <div className="hidden lg:block w-full h-full border-2 border-dashed border-[#3a6b4d]/10 rounded-[32px] bg-white/20  flex-col items-center justify-center text-[#3a6b4d]/30 font-bold text-sm tracking-widest uppercase">
              {/* Espaço reservado */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
