'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  { icon: User, label: 'Meu perfil', path: '/profile', isProtected: true }
]

export function BottomNavbar() {
  const pathname = usePathname()
  const { isLoggedIn, isLoading } = useAuth()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [clickedSection, setClickedSection] = useState('')

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isProtected: boolean,
    label: string
  ) => {
    if (isProtected && !isLoading && !isLoggedIn) {
      e.preventDefault()
      setClickedSection(label)
      setIsDrawerOpen(true)
    }
  }

  return (
    <>
      <div className="fixed bottom-1 left-6 right-6 bg-white/60 shadow-md backdrop-blur-md rounded-full z-[100] md:hidden pointer-events-none">
        <nav className="border-2 border-[#e0e8dd] rounded-full px-4 pt-2 flex justify-around items-center pointer-events-auto shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
          {navItems.map(item => {
            const isActive = pathname === item.path
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                href={item.path}
                prefetch={false}
                onClick={e => handleNavigation(e, item.isProtected, item.label)}
                className="flex flex-col items-center py-1 px-3 relative outline-none group"
              >
                <div
                  className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}
                >
                  <Icon
                    size={22}
                    color="#5e9873"
                    strokeWidth={isActive ? 1.8 : 1.4}
                  />
                </div>

                <span
                  className={`text-[10px] font-normal tracking-tight mt-1 transition-colors duration-300 ${
                    isActive
                      ? 'text-[#2c4c3b] font-medium'
                      : 'text-[#2c4c3b]/40'
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
