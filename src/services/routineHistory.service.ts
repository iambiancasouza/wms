import { createClient } from '@/lib/supabase/client'
import { Routine } from '@/types/db'

const supabase = createClient()

export async function getRoutineHistory(
  userId: string,
  routineDate: string
): Promise<Routine[]> {

  const { data, error } = await supabase
    .from('user_routines')
    .select('*')
    .eq('user_id', userId)
    .eq('routine_date', routineDate)

  if (error) throw error

  return data ?? []
}