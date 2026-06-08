'use client'

import { Bell } from 'lucide-react'
import { showToast } from '@/providers/ToasterProvider'

interface NotificationBellProps {
  unreadCount: number
}

export function NotificationBell({ unreadCount }: NotificationBellProps) {
  const handleClick = () => {
    showToast.default('Notificações ainda estão em desenvolvimento.')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative text-[#4f7c60] active:scale-95 transition-transform"
      aria-label="Notificações"
    >
      <Bell className="w-[26px] h-[26px]" strokeWidth={2.2} />

      {unreadCount > 0 && (
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
      )}
    </button>
  )
}
