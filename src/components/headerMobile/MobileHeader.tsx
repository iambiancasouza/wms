'use client'

import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/providers/UserAuthProvider'
import { useNotifications } from '@/hooks/useNotifications'
import { useSkinMood } from '@/hooks/useSkinMood'
import { SkinMoodModal } from '@/components/modals/SkinMoodModal'
import { NotificationBell } from '@/components/headerMobile/NotificationBell'

export function MobileHeader() {
  const { isLoggedIn, userName } = useAuth()
  const { unreadCount } = useNotifications(isLoggedIn)
  const {
    moods,
    open,
    isSaving,
    hasMoodToday,
    openMoodModal,
    closeMoodModal,
    toggleSkinMood,
    submitSkinMood
  } = useSkinMood()

  const displayName =
    isLoggedIn && userName ? userName.split(' ')[0] : 'Skin lover'

  return (
    <>
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
          <div className="w-[90px] flex justify-start">
            <div className="relative w-[90px] h-[45px]">
              <Image
                src="/wms_logo.png"
                alt="WMS logo"
                fill
                priority
                className="object-contain scale-[3.8] origin-center"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-start justify-center text-center ml-6">
            <span className="font-medium text-gray-500 text-[16px] tracking-wide leading-none mt-1">
              Olá{displayName ? `, ${displayName}` : ''}!
            </span>

            <button
              onClick={openMoodModal}
              className="flex items-center gap-1 text-[#6f957a] mt-1 active:scale-95 transition-transform"
            >
              <span className="text-[13px] font-medium whitespace-nowrap">
                {hasMoodToday
                  ? 'Editar estado da pele'
                  : 'Como está sua pele hoje?'}
              </span>

              <ChevronDown
                className="w-[14px] h-[14px]"
                strokeWidth={2.5}
              />
            </button>
          </div>

          <div className="w-[90px] flex justify-end">
            <NotificationBell unreadCount={unreadCount} />
          </div>
        </div>
      </header>

      <SkinMoodModal
        open={open}
        selectedMoods={moods}
        isSaving={isSaving}
        hasMoodToday={hasMoodToday}
        onCloseAction={closeMoodModal}
        onToggleAction={toggleSkinMood}
        onSubmitAction={submitSkinMood}
      />
    </>
  )
}
