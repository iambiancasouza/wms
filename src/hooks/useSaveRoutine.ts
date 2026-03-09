import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { toast } from 'sonner'

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
    onSuccess?: () => void,
    routineId?: string
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

          toast.success('Rotina removida com sucesso!')
        } else {
          await updateRoutine(routineId, products)

          toast.success('Rotina atualizada com sucesso!')
        }
      } else {
        if (products.length === 0) {
          toast.error('Adicione pelo menos um produto para salvar.')
          setIsSaving(false)
          return
        }

        await createRoutine(user.id, period, products, date)

        toast.success('Rotina salva com sucesso!')
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Erro completo:', error)
      console.log('Erro JSON:', JSON.stringify(error, null, 2))

      if (error instanceof Error && error.message === 'RLS_BLOCKED') {
        toast.error('Erro no Supabase: Ação bloqueada pelas políticas de RLS!')
      } else {
        toast.error('Ocorreu um erro ao processar sua rotina.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return { saveRoutine, isSaving }
}
