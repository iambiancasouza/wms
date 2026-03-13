import { createClient } from '@/lib/supabase/client'

export async function createNotification(
  title: string,
  message: string,
  type: string
) {
  const supabase = createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Usuário não autenticado')
    return
  }

  const { error } = await supabase.from('notifications').insert({
    user_id: user.id,
    title,
    message,
    type
  })

  if (error) {
    console.error('Erro ao criar notificação:', error)
  }
}