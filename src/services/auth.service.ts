import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

const supabase = createClient()

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  return data.session
}

export function subscribeToAuthChanges(
  callback: (event: string, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })

  return data.subscription
}