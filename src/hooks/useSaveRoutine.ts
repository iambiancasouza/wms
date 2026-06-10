import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { showToast } from '@/providers/ToasterProvider'

import {
  deleteRoutine,
  updateRoutine,
  createRoutine
} from '@/services/routine.service'

export function useSaveRoutine() {
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  const saveRoutine = async (
    period: 'diurna' | 'noturna',
    products: Product[],
    date: Date,
    onSuccess?: () => void | Promise<void>,
    routineId?: string,
    notes?: string
  ) => {
    setIsSaving(true)

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      if (routineId) {
        if (products.length === 0) {
          await deleteRoutine(routineId)

          showToast.success('Rotina removida com sucesso!')
        } else {
          await updateRoutine(routineId, products, date, notes)

          showToast.success('Rotina atualizada com sucesso!')
        }
      } else {
        if (products.length === 0) {
          showToast.error('Adicione pelo menos um produto para salvar.')
          setIsSaving(false)
          return
        }

        await createRoutine(user.id, period, products, date, notes)
        

        showToast.success('Rotina salva com sucesso!')
      }

      if (onSuccess) {
        await onSuccess()
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message?: unknown }).message || '')
            : ''

      console.error('Erro completo:', error)
      console.error('Mensagem do erro:', message)

      if (message.includes('RLS_BLOCKED')) {
        showToast.error('Erro no Supabase: Ação bloqueada pelas políticas de RLS!')
      } else if (
        message.includes('42703') ||
        message.toLowerCase().includes('notes') && message.toLowerCase().includes('does not exist')
      ) {
        showToast.error('A coluna de notas ainda não existe no banco. Aplique a migration `20260522_add_notes_to_user_routines.sql`.')
      } else {
        showToast.error('Ocorreu um erro ao processar sua rotina.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return { saveRoutine, isSaving }
}
