import { useCallback, useEffect, useState } from 'react'
import { SkinMood } from '@/types/skin'
import { getTodaySkinMood, saveSkinMood } from '@/services/skinMood.service'
import { showToast } from '@/providers/ToasterProvider'
import { useAuth } from '@/providers/UserAuthProvider'

export function useSkinMood() {
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const [moods, setMoods] = useState<SkinMood[]>([])
  const [savedMoods, setSavedMoods] = useState<SkinMood[]>([])
  const [todayMoodId, setTodayMoodId] = useState<string | null>(null)
  const [hasMoodToday, setHasMoodToday] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadTodayMood = useCallback(async () => {
    if (!isLoggedIn) {
      setMoods([])
      setSavedMoods([])
      setTodayMoodId(null)
      setHasMoodToday(false)
      return
    }

    try {
      const todayMood = await getTodaySkinMood()
      const nextMoods = todayMood?.moods ?? []

      setMoods(nextMoods)
      setSavedMoods(nextMoods)
      setTodayMoodId(todayMood?.id ?? null)
      setHasMoodToday(Boolean(todayMood))
    } catch (error) {
      console.error('Erro ao buscar estado da pele de hoje:', error)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (authLoading) return

    void loadTodayMood()
  }, [authLoading, loadTodayMood])

  function openMoodModal() {
    if (authLoading) return

    if (!isLoggedIn) {
      showToast.default('Faça login para registrar o estado da pele')
      return
    }

    setMoods(savedMoods)
    setOpen(true)
  }

  function closeMoodModal() {
    setOpen(false)
    setMoods(savedMoods)
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
      const result = await saveSkinMood(moods, todayMoodId)

      setOpen(false)
      setSavedMoods(moods)
      setMoods(moods)
      setTodayMoodId(result.recordId || todayMoodId)
      setHasMoodToday(true)

      showToast.success(
        result.action === 'updated'
          ? 'Estado da pele atualizado!'
          : 'Estado da pele registrado!'
      )

      return true
    } catch (error) {
      console.error('Erro ao salvar estado da pele:', error)

      if (error instanceof Error) {
        if (error.message === 'Usuário não autenticado') {
          showToast.error('Você precisa estar logado para registrar')
        } else if (error.message === 'RLS_BLOCKED') {
          showToast.error('Registro bloqueado pelas políticas do banco')
        } else if (error.message === 'DAILY_MOOD_ALREADY_EXISTS') {
          showToast.error('Você já registrou o estado da pele hoje')
          await loadTodayMood()
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
    hasMoodToday,
    openMoodModal,
    closeMoodModal,
    toggleSkinMood,
    submitSkinMood
  }
}
