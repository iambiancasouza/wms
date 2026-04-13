import { useState } from 'react'
import { SkinMood } from '@/types/skin'
import { saveSkinMood } from '@/services/skinMood.service'
import { showToast } from '@/providers/ToasterProvider'
import { useAuth } from '@/providers/UserAuthProvider'

export function useSkinMood() {
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const [moods, setMoods] = useState<SkinMood[]>([])
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function openMoodModal() {
    if (authLoading) return

    if (!isLoggedIn) {
      showToast.default('Faça login para registrar o estado da pele')
      return
    }

    setOpen(true)
  }

  function closeMoodModal() {
    setOpen(false)
    setMoods([])
  }

  function toggleSkinMood(value: SkinMood) {
    setMoods(current => {
      if (current.includes(value)) {
        return current.filter(item => item !== value)
      }

      if (current.length >= 2) {
        showToast.default('Selecione no máximo 2 estados da pele')
        return current
      }

      return [...current, value]
    })
  }

  async function submitSkinMood() {
    if (!isLoggedIn) {
      showToast.error('Você precisa estar logado para registrar')
      return false
    }

    if (moods.length === 0) {
      showToast.default('Selecione pelo menos 1 estado da pele')
      return false
    }

    try {
      setIsSaving(true)
      await saveSkinMood(moods)
      showToast.success('Estado da pele registrado!')
      setOpen(false)
      setMoods([])
      return true
    } catch (error) {
      console.error('Erro ao salvar estado da pele:', error)

      if (error instanceof Error) {
        if (error.message === 'Usuário não autenticado') {
          showToast.error('Você precisa estar logado para registrar')
        } else if (error.message === 'RLS_BLOCKED') {
          showToast.error('Registro bloqueado pelas políticas do banco')
        } else {
          showToast.error(error.message)
        }
      } else {
        showToast.error('Erro ao registrar estado da pele')
      }

      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
    moods,
    open,
    isSaving,
    openMoodModal,
    closeMoodModal,
    toggleSkinMood,
    submitSkinMood
  }
}
