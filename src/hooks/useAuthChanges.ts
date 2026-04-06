import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

export function useAuthChanges(
  callback: (event: string, session: Session | null) => void
) {
  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session)
      }
    )

    return () => subscription?.unsubscribe()
  }, [callback])
}