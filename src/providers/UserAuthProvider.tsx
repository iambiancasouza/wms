'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo
} from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { withTimeout } from '@/lib/async'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type SupabaseClientType = ReturnType<typeof createClient>

interface AuthContextData {
  user: User | null
  profile: Profile | null
  isLoggedIn: boolean
  isLoading: boolean
  userName: string
  refreshProfile: () => Promise<void>
  supabase: SupabaseClientType
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
        const { data, error } = await withTimeout(
          supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single(),
          8000,
          'Tempo esgotado ao buscar perfil'
        )

        if (!error && data) {
          setProfile(data as Profile)
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        setProfile(null)
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

    const initializeSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          'Tempo esgotado ao restaurar sessao'
        )
        if (mounted && session?.user && !error) {
          await handleAuthStateChange(session.user)
        } else if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Erro na sessão inicial:', error)
        if (mounted) setIsLoading(false)
      }
    }

    initializeSession()

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

  const userName = useMemo(() => {
    return (
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'Visitante'
    )
  }, [user])

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoggedIn: !!user,
      isLoading,
      userName,
      refreshProfile: () => (user ? fetchProfile(user.id) : Promise.resolve()),
      supabase
    }),
    [user, profile, isLoading, userName, fetchProfile, supabase]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
