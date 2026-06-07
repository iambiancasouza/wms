import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'

const supabase = createClient()

export async function getUserRoutines(userId: string) {
  const { data, error } = await supabase
    .from('user_routines')
    .select('id, period, routine_date, products, notes')
    .eq('user_id', userId)

  if (error) throw error

  return data
}

export async function getActiveProducts(userId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, brand, category, image_url')
    .neq('status', 'finished')
    .eq('user_id', userId)

  if (error) throw error

  return data as Product[]
}
