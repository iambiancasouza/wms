'use client'

import Image from 'next/image'
import { ChevronDown, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function MobileHeader() {
  const { isLoggedIn, userName } = useAuth()

  const displayName =
    isLoggedIn && userName ? userName.split(' ')[0] : 'Você'

  return (
    <header
      className="
      fixed top-0 inset-x-0 z-[100]
      lg:hidden
      px-5
      pb-4
      pt-[calc(env(safe-area-inset-top)+8px)]
      bg-
      backdrop-blur-md
      border-2 border-white/40
      shadow-md
      rounded-b-[34px]
      flex items-center justify-between
    "
    >
      {/* ESQUERDA — LOGO */}
      <div className="flex-shrink-0">
        <Image
          src="/logowms.png"
          alt="WMS logo"
          width={72}
          height={28}
          priority
          className="object-contain"
        />
      </div>

      {/* CENTRO */}
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <span className="font-bold text-[#4f7c60] text-[16px] tracking-wide leading-none">
          Olá, {displayName}
        </span>

        <button className="flex items-center gap-1 text-[#6f957a] mt-1 active:scale-95 transition-transform">
          <span className="text-[13px] font-medium">
            Mood da pele hoje
          </span>

          <ChevronDown
            className="w-[14px] h-[14px]"
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* DIREITA */}
      <div className="relative flex-shrink-0 flex items-center justify-end w-[80px]">
        <button className="relative text-[#4f7c60] active:scale-95 transition-transform">
          <Bell className="w-[26px] h-[26px]" strokeWidth={2.2} />

          {/* badge */}
          <span
            className="
            absolute -top-1 -right-1
            flex h-[18px] w-[18px]
            items-center justify-center
            rounded-full
            bg-[#7eba6b]
            border-[2px] border-white
            text-[9px] font-bold text-white
            shadow-sm
          "
          >
            
          </span>
        </button>
      </div>
    </header>
  )
}