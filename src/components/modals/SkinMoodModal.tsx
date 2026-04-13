'use client'

import { Loader2, X } from 'lucide-react'
import { SKIN_MOOD_OPTIONS, SkinMood } from '@/types/skin'

interface Props {
  open: boolean
  selectedMoods: SkinMood[]
  isSaving: boolean
  hasMoodToday: boolean
  onCloseAction: () => void
  onToggleAction: (mood: SkinMood) => void
  onSubmitAction: () => void
}

export function SkinMoodModal({
  open,
  selectedMoods,
  isSaving,
  hasMoodToday,
  onCloseAction,
  onToggleAction,
  onSubmitAction
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[105] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseAction}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-[110] bg-white/30 backdrop-blur-2xl border-t border-white/60 rounded-t-3xl p-7 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-white/50 transform transition-transform duration-500 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <button
          onClick={onCloseAction}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#3a6b4d] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-5 mt-1">
          <div className="w-12 h-1 bg-gray-400/40 rounded-full mb-4" />

          <h2 className="text-xl font-bold text-[#3a6b4d] mt-1 font-poppins">
            Como sua pele está hoje?
          </h2>

          <p className="text-sm text-gray-600 font-medium px-4">
            Selecione até 2 estados
          </p>

          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            {SKIN_MOOD_OPTIONS.map(option => {
              const isSelected = selectedMoods.includes(option.value)

              return (
                <button
                  key={option.value}
                  onClick={() => onToggleAction(option.value)}
                  className={`rounded-2xl border px-3 py-3 text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'border-[#3a6b4d] bg-[#3a6b4d]/10 text-[#2a4f3a] shadow-md'
                      : 'border-white/70 bg-white/40 text-gray-700 hover:bg-white/60'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="font-bold text-sm">{option.label}</span>
                  </span>
                  <span className="mt-1.5 block text-xs text-gray-500">
                    {option.description}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="w-full space-y-4 mt-6 pt-3">
            <button
              onClick={onSubmitAction}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-[#3a6b4d] hover:bg-[#2a4f3a] text-white rounded-xl py-4 font-bold shadow-lg shadow-[#3a6b4d]/50 transition-all active:scale-95 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {hasMoodToday
                ? 'Editar estado da pele'
                : 'Registrar estado da pele'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
