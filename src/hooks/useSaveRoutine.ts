// src/hooks/useSaveRoutine.ts
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Product } from '@/types/product'

export function useSaveRoutine() {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)

  const saveRoutine = async (period: string, routineItems: Product[], onSuccess: () => void) => {
    if (routineItems.length === 0) {
      toast.error('Adicione pelo menos um produto à sua rotina.')
      return
    }

    setIsSaving(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const routineData = {
        user_id: user.id,
        period: period,
        products: routineItems.map(p => ({ id: p.id, name: p.name, brand: p.brand }))
      }

      const { error } = await supabase.from('user_routines').insert(routineData)

      if (error) throw error

      toast.success('Rotina registrada com sucesso! ✨')
      onSuccess() // Executa a função de fechar o modal e recarregar a página
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar sua rotina. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return { saveRoutine, isSaving }
}