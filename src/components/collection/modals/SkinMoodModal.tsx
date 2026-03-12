'use client'

import { SkinMood } from "@/types/skin"

interface Props {
  open: boolean
  onCloseAction: () => void
  onSelectAction: (mood: SkinMood) => void
}

export function SkinMoodModal({ open, onCloseAction, onSelectAction }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40">

      <div className="
        w-full
        bg-white
        rounded-t-[28px]
        p-6
        animate-in slide-in-from-bottom
      ">

        <h2 className="text-lg font-semibold mb-4">
          Como sua pele está hoje?
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <button onClick={() => onSelectAction("good")}>Radiante</button>
          <button onClick={() => onSelectAction("dry")}>Ressecada</button>
          <button onClick={() => onSelectAction("oily")}>Oleosa</button>
          <button onClick={() => onSelectAction("acne")}>Acne</button>
          <button onClick={() => onSelectAction("sensitive")}>Sensível</button>
          <button onClick={() => onSelectAction("dull")}>Opaca</button>

        </div>

        <button
          onClick={onCloseAction}
          className="mt-5 text-sm text-gray-500"
        >
          Cancelar
        </button>

      </div>
    </div>
  )
}