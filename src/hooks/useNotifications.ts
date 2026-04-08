'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Notification =
  Database['public']['Tables']['notifications']['Row']

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    const supabase = createClient()
    let mounted = true

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar notificações:', error)
        return
      }

      if (data && mounted) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.read).length)
      }
    }

    fetchNotifications()

    return () => {
      mounted = false
    }
  }, [enabled])

  return {
    notifications,
    unreadCount
  }
}
