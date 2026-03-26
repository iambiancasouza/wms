import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { openProductsIfClosed } from '@/services/product.service'
import { format } from 'date-fns'

export async function createRoutine(
  userId: string,
  period: 'diurna' | 'noturna',
  products: Product[],
  date: Date
) {
  const supabase = createClient()

  const routineDate = format(date, 'yyyy-MM-dd')

  const { error } = await supabase
    .from('user_routines')
    .insert({
      user_id: userId,
      period,
      routine_date: routineDate,
      products
    })

  if (error) throw error

  await openProductsIfClosed(supabase, products, routineDate)
}

export async function updateRoutine(
  routineId: string,
  products: Product[],
  date: Date
) {
  const supabase = createClient()

  const routineDate = format(date, 'yyyy-MM-dd')

  const { error } = await supabase
    .from('user_routines')
    .update({
      products
    })
    .eq('id', routineId)

  if (error) throw error

  await openProductsIfClosed(supabase, products, routineDate)
}

export async function deleteRoutine(routineId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('user_routines')
    .delete()
    .eq('id', routineId)

  if (error) throw error
}