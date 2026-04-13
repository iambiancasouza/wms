import { createClient } from '@/lib/supabase/client'
import { SkinMood } from '@/types/skin'

export async function saveSkinMood(moods: SkinMood[]) {
  const supabase = createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase.from('skin_moods').insert({
    user_id: user.id,
    moods
  })

  if (error) {
    if (error.code === '42501') {
      throw new Error('RLS_BLOCKED')
    }

    throw error
  }
}
