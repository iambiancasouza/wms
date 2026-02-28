'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { X, Menu, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Notifications } from '@/components/layout/Notifications'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getUserName = (user: any) => {
      if (!user) return null
      if (user.user_metadata?.full_name) {
        return user.user_metadata.full_name.split(' ')[0] 
      }
      return user.email?.split('@')[0]
    }

    const checkAuth = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setUserName(getUserName(user))
    }

    checkAuth()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user)
      setUserName(getUserName(session?.user))

      if (event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <div className="w-full px-2 sm:px-4 pt-3 relative z-50">
      <header className=" hidden md:block h-14 w-full border border-[#e0e8dd] bg-white/60 backdrop-blur-sm rounded-full shadow-md">
        <div className="h-full flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            <span className="text-lg sm:text-xl font-bold font-poppins bg-gradient-to-r from-[#8ec5a0] via-[#5a9e74] to-[#3a6b4d] text-transparent bg-clip-text">
              WMS
            </span>
          </Link>

          {/* Central Nav Links - Authenticated Only, hidden on mobile */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center justify-center flex-grow gap-8">
              <Link
                href="/"
                className={`px-4 py-2 transition-colors duration-300 ease-in-out text-sm font-medium ${
                  isActive('/')
                    ? 'text-[#3a6b4d]'
                    : 'text-gray-500 hover:text-[#5a9e74]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/collection"
                className={`px-4 py-2 transition-colors duration-300 ease-in-out text-sm font-medium ${
                  isActive('/collection')
                    ? 'text-[#3a6b4d]'
                    : 'text-gray-500 hover:text-[#5a9e74]'
                }`}
              >
                Minha Coleção
              </Link>
              <Link
                href="/favorites"
                className={`px-4 py-2 transition-colors duration-300 ease-in-out text-sm font-medium ${
                  isActive('/collection')
                    ? 'text-[#3a6b4d]'
                    : 'text-gray-500 hover:text-[#5a9e74]'
                }`}
              >
                Meus favoritos
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-8">
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-5">
                <Link
                  href="/auth/login"
                  className="group relative px-4 py-2 transition-all duration-500 ease-in-out"
                >
                  <span className="absolute inset-0 w-full h-full rounded-full bg-[#3a6b4d]/10 border border-[#3a6b4d]/30 backdrop-blur-md shadow-[0_0_15px_rgba(58,107,77,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-0"></span>
                  <span className="relative z-10 text-[15px] font-medium text-[#3a6b4d] group-hover:text-[#3a6b4d] transition-colors">
                    Entrar
                  </span>
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="group relative px-4 py-2 transition-all duration-500 ease-in-out"
                >
                  <span className="absolute inset-0 w-full h-full rounded-full bg-[#3a6b4d]/10 border border-[#3a6b4d]/30 backdrop-blur-md shadow-[0_0_15px_rgba(58,107,77,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-0"></span>
                  <span className="relative z-10 text-[15px] font-medium text-[#3a6b4d] group-hover:text-[#3a6b4d] transition-colors">
                    Criar conta
                  </span>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                {' '}
                {/* User actions for authenticated desktop */}
                <span className="text-xs text-gray-500 hidden xl:block">
                  Welcome back,{' '}
                  <span className="font-semibold text-[#3a6b4d] text-sm">
                    {userName}!
                  </span>
                </span>
                <Notifications />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#3a6b4d] hover:text-[#ec3636]"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            )}
            {/* Mobile menu toggle - visible only on mobile (md:hidden) */}
            <div className="md:hidden flex gap-0.5 items-center">
              {isAuthenticated && <Notifications />}
              <button
                className="p-1"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="text-[#3a6b4d]" size={24} />
                ) : (
                  <Menu className="text-[#3a6b4d]" size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[4.25rem] left-2 right-2 sm:left-4 sm:right-4 bg-white bg-opacity-95 backdrop-blur-sm border border-[#e0e8dd] z-40 shadow-md rounded-2xl mt-1">
          <nav className="py-4 px-4 flex flex-col space-y-4">
            {isAuthenticated && (
              <div className="px-2 pb-2 text-sm text-gray-500 border-b border-gray-100 mb-2">
                Bem vindo,{' '}
                <span className="font-semibold text-[#3a6b4d]">{userName}</span>
              </div>
            )}

            <Link
              href="/"
              className={`text-sm font-medium ${isActive('/') ? 'text-[#3a6b4d] bg-[#f0f5ed]' : 'text-gray-500'} hover:text-[#5a9e74] hover:bg-[#f0f5ed] p-2 rounded-md transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/collection"
                  className={`text-sm font-medium ${isActive('/collection') ? 'text-[#3a6b4d] bg-[#f0f5ed]' : 'text-gray-500'} hover:text-[#5a9e74] hover:bg-[#f0f5ed] p-2 rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Minha Coleção
                </Link>
                <Link
                  href="/favorites"
                  className={`text-sm font-medium ${isActive('/collection') ? 'text-[#3a6b4d] bg-[#f0f5ed]' : 'text-gray-500'} hover:text-[#5a9e74] hover:bg-[#f0f5ed] p-2 rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meus favoritos
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-500 hover:text-[#5a9e74] hover:bg-[#f0f5ed] p-2 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm font-medium text-white bg-gradient-to-r from-[#8ec5a0] to-[#5a9e74] hover:from-[#7ab88f] hover:to-[#4a8a63] p-2 rounded-md transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Criar conta
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="text-sm font-medium text-gray-500 hover:text-[#5a9e74] hover:bg-[#f0f5ed] p-2 rounded-md transition-colors text-left flex items-center gap-2 w-full"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}