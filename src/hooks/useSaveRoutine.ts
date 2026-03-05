import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'
import { Product } from '@/types/product'
import { toast } from 'sonner' // Assumindo que você usa sonner para notificações

export function useSaveRoutine() {
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const saveRoutine = async (
    period: 'diurna' | 'noturna',
    products: Product[],
    date: Date, // NOVO: Agora aceita a data exata da rotina
    onSuccess?: () => void
  ) => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Pega o início e fim do dia que o usuário selecionou
      const start = startOfDay(date).toISOString()
      const end = endOfDay(date).toISOString()

      // 1. Verifica se já existe uma rotina para este dia e período específico
      const { data: existingRoutine } = await supabase
        .from('user_routines')
        .select('id')
        .eq('user_id', user.id)
        .eq('period', period)
        .gte('created_at', start)
        .lte('created_at', end)
        .single()

      if (existingRoutine) {
        // 2A. Se existir, fazemos um UPDATE (Edição)
        const { error } = await supabase
          .from('user_routines')
          .update({ products })
          .eq('id', existingRoutine.id)

        if (error) throw error
      } else {
        // 2B. Se não existir, fazemos um INSERT normal (Criação)
        const { error } = await supabase
          .from('user_routines')
          .insert({
            user_id: user.id,
            period,
            products,
            created_at: date.toISOString() // Salva usando a data do dia selecionado
          })

        if (error) throw error
      }

      toast.success('Rotina salva com sucesso!')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Erro ao salvar rotina:', error)
      toast.error('Erro ao salvar a rotina.')
    } finally {
      setIsSaving(false)
    }
  }

  return { saveRoutine, isSaving }
}