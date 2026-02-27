import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setIsLoggedIn(true)
        const metadata = session.user.user_metadata
        const name = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || 'visitante'
        setUserName(name)
      } else {
        setIsLoggedIn(false)
        setUserName('')
      }
      
      setIsLoading(false)
    }

    checkUserStatus()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false)
        setUserName('')
      } else if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true)
        const metadata = session.user.user_metadata
        const name = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || 'visitante'
        setUserName(name)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { isLoading, isLoggedIn, userName }
}