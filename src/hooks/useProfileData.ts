'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/providers/UserAuthProvider'
import { showToast } from '@/providers/ToasterProvider'
import { updateProfile } from '@/services/profile.service'
import type { Profile } from '@/types/db'

const SKIN_TYPE_OPTIONS = [
  'normal',
  'oleosa',
  'seca',
  'mista',
  'acnéica',
  'madura',
  'sensível'
]

const CONCERN_OPTIONS = [
  'acne',
  'manchas',
  'sensibilidade',
  'oleosidade',
  'poros',
  'linhas finas'
]

interface ProfileFormState {
  fullName: string
  avatarUrl: string
  birthDate: string
  goal: string
  skinTypes: string[]
  concerns: string[]
  customConcern: string
}

const emptyState: ProfileFormState = {
  fullName: '',
  avatarUrl: '',
  birthDate: '',
  goal: '',
  skinTypes: [],
  concerns: [],
  customConcern: ''
}

function toDateInputValue(value: Profile['birth_date'] | undefined) {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

function normalizeList(values: string[] | null | undefined) {
  return Array.from(new Set((values ?? []).map(value => value.trim()).filter(Boolean)))
}

function buildInitialState(profile: Profile | null, fallbackName: string) {
  return {
    fullName: profile?.full_name ?? fallbackName ?? '',
    avatarUrl: profile?.avatar_url ?? '',
    birthDate: toDateInputValue(profile?.birth_date),
    goal: profile?.goal ?? '',
    skinTypes: normalizeList(profile?.skin_type),
    concerns: normalizeList(profile?.concerns),
    customConcern: ''
  }
}

export function useProfileData() {
  const { user, profile, userName, isLoading, refreshProfile, supabase } = useAuth()
  const [state, setState] = useState<ProfileFormState>(emptyState)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setState(buildInitialState(profile, userName))
  }, [profile, userName])

  const fullName = state.fullName
  const avatarUrl = state.avatarUrl
  const birthDate = state.birthDate
  const goal = state.goal
  const skinTypes = state.skinTypes
  const concerns = state.concerns
  const customConcern = state.customConcern

  const setFullName = useCallback((value: string) => {
    setState(current => ({ ...current, fullName: value }))
  }, [])

  const setAvatarUrl = useCallback((value: string) => {
    setState(current => ({ ...current, avatarUrl: value }))
  }, [])

  const setBirthDate = useCallback((value: string) => {
    setState(current => ({ ...current, birthDate: value }))
  }, [])

  const setGoal = useCallback((value: string) => {
    setState(current => ({ ...current, goal: value }))
  }, [])

  const setCustomConcern = useCallback((value: string) => {
    setState(current => ({ ...current, customConcern: value }))
  }, [])

  const toggleSkinType = useCallback((value: string) => {
    setState(current => {
      const isSelected = current.skinTypes.includes(value)

      if (isSelected) {
        return {
          ...current,
          skinTypes: current.skinTypes.filter(item => item !== value)
        }
      }

      if (current.skinTypes.length >= 2) {
        showToast.error('Selecione até 2 tipos de pele.')
        return current
      }

      return {
        ...current,
        skinTypes: [...current.skinTypes, value]
      }
    })
  }, [])

  const toggleConcern = useCallback((value: string) => {
    setState(current => {
      const isSelected = current.concerns.includes(value)

      return {
        ...current,
        concerns: isSelected
          ? current.concerns.filter(item => item !== value)
          : [...current.concerns, value]
      }
    })
  }, [])

  const addCustomConcern = useCallback(() => {
    setState(current => {
      const value = current.customConcern.trim()
      if (!value) return current

      if (current.concerns.includes(value)) {
        return { ...current, customConcern: '' }
      }

      return {
        ...current,
        concerns: [...current.concerns, value],
        customConcern: ''
      }
    })
  }, [])

  const removeConcern = useCallback((value: string) => {
    setState(current => ({
      ...current,
      concerns: current.concerns.filter(item => item !== value)
    }))
  }, [])

  const resetProfile = useCallback(() => {
    setState(buildInitialState(profile, userName))
  }, [profile, userName])

  const saveProfile = useCallback(async () => {
    if (!user) {
      showToast.error('Você precisa estar autenticada para salvar o perfil.')
      return
    }

    setIsSaving(true)

    try {
      await updateProfile(user.id, {
        full_name: fullName,
        avatar_url: avatarUrl,
        birth_date: birthDate,
        goal,
        skin_type: skinTypes,
        concerns
      })

      await refreshProfile()
      showToast.success('Perfil atualizado com sucesso.')
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error)
      showToast.error('Não foi possível salvar o perfil.')
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [avatarUrl, birthDate, concerns, fullName, goal, refreshProfile, skinTypes, user])

  const hasProfile = Boolean(profile || user)

  const accountStatus = useMemo(
    () => ({
      onboardingCompleted: profile?.onboarding_completed ?? false,
      email: user?.email ?? 'Não informado'
    }),
    [profile?.onboarding_completed, user?.email]
  )

  return {
    user,
    profile,
    supabase,
    isLoading,
    isSaving,
    hasProfile,
    accountStatus,
    skinTypeOptions: SKIN_TYPE_OPTIONS,
    concernOptions: CONCERN_OPTIONS,
    fullName,
    avatarUrl,
    birthDate,
    goal,
    skinTypes,
    concerns,
    customConcern,
    setFullName,
    setAvatarUrl,
    setBirthDate,
    setGoal,
    setCustomConcern,
    toggleSkinType,
    toggleConcern,
    addCustomConcern,
    removeConcern,
    saveProfile,
    resetProfile
  }
}
