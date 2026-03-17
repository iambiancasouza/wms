'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode
} from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextData {
  user: User | null
  profile: Profile | null
  isLoggedIn: boolean
  isLoading: boolean
  userName: string
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [supabase] = useState(() => createClient())

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (!error && data) {
          setProfile(data as Profile)
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
      }
    },
    [supabase]
  )

  const handleAuthStateChange = useCallback(
    async (sessionUser: User | null) => {
      if (sessionUser) {
        setUser(sessionUser)

        setIsLoading(false)

        await fetchProfile(sessionUser.id)
      } else {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    },
    [fetchProfile]
  )

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession()
        if (mounted && !error) {
          await handleAuthStateChange(session?.user ?? null)
        } else if (error) {
          setIsLoading(false)
        }
      } catch {
        if (mounted) setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        await handleAuthStateChange(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [handleAuthStateChange, supabase])

  const userName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Visitante'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoggedIn: !!user,
        isLoading,
        userName,
        refreshProfile: () => (user ? fetchProfile(user.id) : Promise.resolve())
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
