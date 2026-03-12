'use client'

import Image from 'next/image'
import { ChevronDown, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// interface MobileHeaderProps {
  // onMoodClick: () => void
// }

export function MobileHeader() {
  const { isLoggedIn, userName } = useAuth()

  const displayName =
    isLoggedIn && userName ? userName.split(' ')[0] : 'Skin lover'

  return (
    <header
      className="
        fixed top-0 inset-x-0 z-[100]
        lg:hidden
        pt-[calc(env(safe-area-inset-top)+12px)]
        pb-5
        px-4
        border-b-2
        border-gray-200
        bg-[#f0f5ed]
        shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        rounded-b-[34px]
      "
    >
      <div className="flex w-full items-center">

        {/* ESQUERDA — LOGO */}
        <div className="w-[90px] flex justify-start">
          <div className="relative w-[90px] h-[45px]">
            <Image
              src="/wms_logo.png"
              alt="WMS logo"
              fill
              priority
              className="object-contain scale-[4] origin-center"
            />
          </div>
        </div>

        {/* CENTRO — SAUDAÇÃO */}
        <div className="flex-1 flex flex-col items-center justify-center text-center ml-6">
          <span className="font-medium text-gray-500 text-[16px] tracking-wide leading-none mt-1">
            Olá{displayName ? `, ${displayName}` : ''}
          </span>

          <button className="flex items-center gap-1 text-[#6f957a] mt-1 active:scale-95 transition-transform">
            <span className="text-[13px] font-medium whitespace-nowrap">
              Como está sua pele hoje?
            </span>

            <ChevronDown
              className="w-[14px] h-[14px]"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* DIREITA — SININHO */}
        <div className="w-[90px] flex justify-end">
          <button className="relative text-[#4f7c60] active:scale-95 transition-transform">
            <Bell className="w-[26px] h-[26px]" strokeWidth={2.2} />

            <span
              className="
                absolute top-0 right-0
                block h-3 w-3
                rounded-full
                bg-[#7eba6b]
                border-[1.5px] border-white
                shadow-sm
              "
            />
          </button>
        </div>

      </div>
    </header>
  )
}