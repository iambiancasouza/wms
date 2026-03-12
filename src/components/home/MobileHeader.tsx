'use client'

import Image from 'next/image'
import { ChevronDown, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function MobileHeader() {
  const { isLoggedIn, userName } = useAuth()

  const displayName =
    isLoggedIn && userName ? userName.split(' ')[0] : ''

  return (
    <header
      className="
      fixed top-[-1] inset-x-0 z-[100]
      lg:hidden
      px-4
      pb-4
      pt-[calc(env(safe-area-inset-top)+12px)]
      bg-white/40
      backdrop-blur-md
      border-2 border-white
      shadow-md
      rounded-b-[34px]
      flex items-center justify-between
    "
    >
     
     
      <div className="relative flex-shrink-0 w-[90px] h-[45px] flex items-start justify-start">
        <Image
          src="/wms_logo.png" 
          alt="WMS logo"
          fill
          priority
          className="object-contain scale-[4] " 
        />
      </div>

      {/* CENTRO */}
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <span className="font-bold text-[#4f7c60] text-[16px] tracking-wide leading-none">
          Olá{displayName ? `, ${displayName}` : ''}
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
      <div className="relative flex-shrink-0 flex items-center justify-end w-[85px]">
        <button className="relative text-[#4f7c60] active:scale-95 transition-transform">
          <Bell className="w-[26px] h-[26px]" strokeWidth={2.2} />

          <span
            className="
            absolute -top-0.5 -right-0.5
            flex h-[15px] w-[15px]
            items-center justify-center
            rounded-full
            bg-[#7eba6b]
            border-[1.5px] border-white
            text-[9px] font-bold text-white
            shadow-sm
          "
          >
            1
          </span>
        </button>
      </div>
    </header>
  )
}