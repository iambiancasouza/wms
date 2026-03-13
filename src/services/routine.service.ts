import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { openProductsIfClosed } from '@/services/product.service'

export async function createRoutine(
  userId: string,
  period: 'diurna' | 'noturna',
  products: Product[],
  date: Date
) {
  const supabase = createClient()

  const routineDate = date.toISOString().split('T')[0]

  const { error } = await supabase
    .from('user_routines')
    .insert({
      user_id: userId,
      period,
      routine_date: routineDate,
      products
    })

  if (error) throw error

  // abre produtos automaticamente
  await openProductsIfClosed(products, routineDate)
}

export async function updateRoutine(
  routineId: string,
  products: Product[],
  date: Date
) {
  const supabase = createClient()

  const routineDate = date.toISOString().split('T')[0]

  const { error } = await supabase
    .from('user_routines')
    .update({
      products
    })
    .eq('id', routineId)

  if (error) throw error

  // 🔥 também abre produtos ao editar
  await openProductsIfClosed(products, routineDate)
}

export async function deleteRoutine(routineId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('user_routines')
    .delete()
    .eq('id', routineId)

  if (error) throw error
}