import { createClient } from '@/lib/supabase/client'
import { RoutineRecord } from '@/types/routine'

const supabase = createClient()

export async function getRoutineHistory(
  userId: string,
  start: string,
  end: string
): Promise<RoutineRecord[]> {

  const { data, error } = await supabase
    .from('user_routines')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data as RoutineRecord[]
}