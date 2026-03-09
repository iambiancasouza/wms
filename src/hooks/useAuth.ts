import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

import {
  getSession,
  subscribeToAuthChanges
} from '@/services/auth.service'

export function useAuth() {

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  function extractUserName(user: User) {

    const metadata = user.user_metadata

    return (
      metadata?.full_name ||
      metadata?.name ||
      user.email?.split('@')[0] ||
      'visitante'
    )
  }

  useEffect(() => {

    const checkUserStatus = async () => {

      const session = await getSession()

      if (session) {
        setIsLoggedIn(true)
        setUserName(extractUserName(session.user))
      } else {
        setIsLoggedIn(false)
        setUserName('')
      }

      setIsLoading(false)
    }

    checkUserStatus()

    const subscription = subscribeToAuthChanges((event, session) => {

      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false)
        setUserName('')
      }

      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true)
        setUserName(extractUserName(session.user))
      }

    })

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  return { isLoading, isLoggedIn, userName }

}