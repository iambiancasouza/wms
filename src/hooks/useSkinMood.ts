import { useState } from "react"
import { SkinMood } from "@/types/skin"

export function useSkinMood() {
  const [mood, setMood] = useState<SkinMood | null>(null)
  const [open, setOpen] = useState(false)

  function openMoodModal() {
    setOpen(true)
  }

  function closeMoodModal() {
    setOpen(false)
  }

  function setSkinMood(value: SkinMood) {
    setMood(value)
    setOpen(false)
  }

  return {
    mood,
    open,
    openMoodModal,
    closeMoodModal,
    setSkinMood
  }
}