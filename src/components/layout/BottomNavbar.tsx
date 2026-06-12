'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Leaf, Heart, Calendar, LayoutGrid, User } from 'lucide-react'
import { useAuth } from '@/providers/UserAuthProvider'
import { AuthDrawer } from '@/components/auth/AuthDrawer'

const navItems = [
  { icon: Leaf, label: 'Home', path: '/', isProtected: false },
  { icon: Heart, label: 'Favoritos', path: '/favorites', isProtected: true },
  { icon: Calendar, label: 'Rotina', path: '/routines', isProtected: true },
  {
    icon: LayoutGrid,
    label: 'Coleção',
    path: '/collection',
    isProtected: true
  },
  { icon: User, label: 'Meu perfil', path: '/profile', isProtected: false }
]

export function BottomNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [clickedSection, setClickedSection] = useState('')

  useEffect(() => {
    router.prefetch('/routines')
    router.prefetch('/collection')
    router.prefetch('/collection/products')
    router.prefetch('/favorites')
    router.prefetch('/profile')
  }, [router])

  const handleNavigation = (
    isProtected: boolean,
    label: string
  ) => {
    if (isProtected && !isLoading && !isLoggedIn) {
      setClickedSection(label)
      setIsDrawerOpen(true)
    }
  }

  return (
    <>
      <div className="fixed bottom-1 left-6 right-6 bg-white/60 shadow-md backdrop-blur-md rounded-full z-[90] md:hidden pointer-events-none">
        <nav className="border-2 border-[#e0e8dd] rounded-full px-4 py-1 flex justify-around items-center pointer-events-auto shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
          {navItems.map(item => {
            const isActive =
              item.path === '/collection'
                ? pathname.startsWith('/collection')
                : pathname === item.path
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                href={item.path}
                prefetch
                onClick={e => {
                  if (item.isProtected && !isLoading && !isLoggedIn) {
                    e.preventDefault()
                    handleNavigation(item.isProtected, item.label)
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center w-[58px] h-[60px] px-0 py-1 outline-none group touch-manipulation rounded-3xl transition-all duration-200 active:scale-95 overflow-hidden flex-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    transition={{
                      type: 'spring',
                      stiffness: 340,
                      damping: 34,
                      mass: 0.9,
                      restDelta: 0.001
                    }}
                    className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/28 shadow-[0_3px_9px_rgba(58,107,77,0.045),inset_0_1px_0_rgba(255,255,255,0.5)]"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/28 via-white/10 to-[#e9f3ec]/14 pointer-events-none" />
                  </motion.div>
                )}

                <div
                  className={`relative z-10 transition-all duration-300 ${
                    isActive ? 'scale-110 -translate-y-0.5' : ''
                  }`}
                >
                  <Icon
                    size={22}
                    color={isActive ? '#2f5e42' : '#6a9f7a'}
                    strokeWidth={isActive ? 1.9 : 1.35}
                  />
                </div>

                <span
                  className={`relative z-10 text-[10px] font-normal tracking-tight mt-1 transition-colors duration-300 ${
                    isActive
                      ? 'text-[#1f3d2d] font-semibold drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]'
                      : 'text-[#2c4c3b]/24'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <AuthDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sectionName={clickedSection}
      />
    </>
  )
}
