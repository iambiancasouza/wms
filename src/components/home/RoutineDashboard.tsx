'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  getDay
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Routine } from '@/types/db'
import { formatDateKey } from '@/lib/date'

interface RoutineDashboardProps {
  completedDates: Date[]
  todayRoutines: Routine[]
  today: Date
  onOpenJournalingAction: (period: 'diurna' | 'noturna') => void
  onOpenDayDetailsAction: (date: Date) => void
}

export function RoutineDashboard({
  completedDates,
  todayRoutines,
  today,
  onOpenJournalingAction,
  onOpenDayDetailsAction
}: RoutineDashboardProps) {
  const [monthOffset, setMonthOffset] = useState(0)
  const currentMonth = addMonths(startOfMonth(today), monthOffset)

  const nextMonth = () => setMonthOffset(current => current + 1)
  const prevMonth = () => setMonthOffset(current => current - 1)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayIndex = getDay(monthStart)
  const emptyDays = Array.from({ length: startDayIndex }, (_, i) => i)
  const todayKey = formatDateKey(today)

  const hasDiurna = todayRoutines.some(r => r.period === 'diurna')
  const hasNoturna = todayRoutines.some(r => r.period === 'noturna')

  const getDateKey = (date: Date): string => {
    return formatDateKey(date)
  }

  return (
    <section className="relative w-full py-6 z-30">
      <div className="container mx-auto px-6 relative z-10">
        <h3 className="text-lg md:text-xl lg:text-2xl font-black text-[#3a6b4d]/75 uppercase tracking-[0.1em] mb-5 text-center">
          Registrar rotina
        </h3>

        <div className="relative rounded-[20px] p-4 md:p-5 border-white/70 shadow-xl shadow-[#3a6b4d]/10 overflow-hidden isolate">
          <Image
            src="/img.png"
            alt="Centella Asiatica Background"
            fill
            className="object-cover opacity-[0.70]  pointer-events-none"
          />

          <div className="absolute inset-0 z-[-1] bg-white/70 backdrop-blur-sm pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-12 relative z-10">
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0">
              <div className="w-full bg-white/40 backdrop-blur-xl rounded-[32px] p-3 md:p-5 border-2 border-white/30 shadow-xl shadow-[#3a6b4d]/5">
                <div className="flex justify-between items-center mb-3 px-1">
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

                <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center transition-[height] duration-200 ease-out">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <span
                      key={`header-${i}`}
                      className="flex h-5 items-center justify-center text-[10px] font-black text-[#3a6b4d]/60"
                    >
                      {d}
                    </span>
                  ))}

                  {emptyDays.map(empty => (
                    <div key={`empty-${empty}`} className="h-8" />
                  ))}

                  {daysInMonth.map(day => {
                    const dayKey = getDateKey(day)
                    const isToday = dayKey === todayKey
                    const hasRoutine = completedDates.some(
                      d => getDateKey(d) === dayKey
                    )

                    return (
                      <div
                        key={day.toString()}
                        className="relative flex h-8 flex-col items-center justify-center"
                      >
                        <button
                          onClick={() =>
                            hasRoutine && onOpenDayDetailsAction(day)
                          }
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all
                          ${
                            isToday
                              ? 'bg-[#3a6b4d]/70 text-white shadow-md'
                              : hasRoutine
                                ? 'text-gray-400 cursor-pointer bg-[#3a6b4d]/10 active:scale-95'
                                : 'text-gray-500 cursor-default opacity-50 hover:opacity-100'
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

              <div className="w-full grid grid-cols-2 gap-4">
                <button
                  onClick={() => onOpenJournalingAction('diurna')}
                  className="group h-32 lg:h-[140px] bg-white/50 backdrop-blur-xl rounded-[32px] border-2 border-white/30 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all hover:bg-white/70"
                >
                  <div className="w-12 h-12 rounded-full bg-[#3a6b4d]/10 shadow-md flex items-center justify-center text-white  transition-colors">
                    <Sun className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-500 text-sm">
                    {hasDiurna ? 'Editar' : 'Diurna'}
                  </span>
                </button>

                <button
                  onClick={() => onOpenJournalingAction('noturna')}
                  className="group h-32 lg:h-[140px] bg-white/50 backdrop-blur-xl rounded-[32px] border-2 border-white/30 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all hover:bg-white/70"
                >
                  <div className="w-12 h-12 rounded-full bg-[#3a6b4d]/10 shadow-md flex items-center justify-center text-gray-500  transition-colors">
                    <Moon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-500 text-sm">
                    {hasNoturna ? 'Editar' : 'Noturna'}
                  </span>
                </button>
              </div>
            </div>

            <div className="hidden lg:block w-full h-full border-2 border-dashed border-[#3a6b4d]/10 rounded-[32px] bg-white/20 flex-col items-center justify-center text-[#3a6b4d]/30 font-bold text-sm tracking-widest uppercase"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
