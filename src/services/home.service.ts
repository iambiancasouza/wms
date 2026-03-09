import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/db'

const supabase = createClient()

export async function getUserRoutines(userId: string) {
  const { data, error } = await supabase
    .from('user_routines')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error

  return data
}

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('status', 'finished')

  if (error) throw error

  return data as Product[]
}