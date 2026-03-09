import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'
import { format } from "date-fns"

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
      routine_date: format(date, "yyyy-MM-dd")
    })

  if (error) throw error
}