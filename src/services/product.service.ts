import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { createNotification } from '@/services/notification.service'

export async function openProductsIfClosed(
  products: Product[],
  routineDate: string
) {
  const supabase = createClient()

  if (!products?.length) return

  const ids = products.map(p => p.id)

  const { data, error } = await supabase
    .from('products')
    .update({
      status: 'open',
      opened_at: routineDate
    })
    .in('id', ids)
    .eq('status', 'closed') // só atualiza se estiver fechado
    .select('id')

  if (error) {
    console.error('Erro ao atualizar produtos automaticamente:', error)
    return
  }

  if (data && data.length > 0) {
    for (const id of data) {
      const product = products.find(p => p.id === id.id)

      if (product) {
        await createNotification(
          product.user_id,
          'Novo produto na rotina',
          `${product.name} começou a ser usado hoje.`,
          
        )
      }
    }
  }
}
