import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/product'

const supabase = createClient()

export async function deleteRoutine(routineId: string) {

  const { data, error } = await supabase
    .from('user_routines')
    .delete()
    .eq('id', routineId)
    .select()

  if (error) throw error
  if (!data || data.length === 0) throw new Error('RLS_BLOCKED')

  return data
}

export async function updateRoutine(routineId: string, products: Product[]) {

  const { data, error } = await supabase
    .from('user_routines')
    .update({ products })
    .eq('id', routineId)
    .select()

  if (error) throw error
  if (!data || data.length === 0) throw new Error('RLS_BLOCKED')

  return data
}

export async function createRoutine(
  userId: string,
  period: 'diurna' | 'noturna',
  products: Product[],
  date: Date
) {

  const { error } = await supabase
    .from('user_routines')
    .insert({
      user_id: userId,
      period,
      products,
      created_at: date.toISOString()
    })

  if (error) throw error
}