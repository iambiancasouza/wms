import { createClient } from '@/lib/supabase/client'
import { normalizeSkinMood, SkinMood } from '@/types/skin'

interface TodaySkinMoodRecord {
  id: string
  moods: string[] | null
  created_at: string | null
}

interface SaveSkinMoodResult {
  action: 'created' | 'updated'
  recordId: string
}

async function getAuthenticatedUser() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Usuário não autenticado')
  }

  return { supabase, user }
}

function getTodayBounds() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return {
    start: start.toISOString(),
    end: end.toISOString()
  }
}

export async function getTodaySkinMood() {
  const { supabase, user } = await getAuthenticatedUser()
  const { start, end } = getTodayBounds()

  const { data, error } = await supabase
    .from('skin_moods')
    .select('id, moods, created_at')
    .eq('user_id', user.id)
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<TodaySkinMoodRecord>()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return {
    ...data,
    moods: (data.moods ?? [])
      .map(normalizeSkinMood)
      .filter((mood): mood is SkinMood => mood !== null)
  }
}

export async function saveSkinMood(
  moods: SkinMood[],
  existingMoodId?: string | null
): Promise<SaveSkinMoodResult> {
  const { supabase, user } = await getAuthenticatedUser()
  let targetMoodId = existingMoodId ?? null

  if (!targetMoodId) {
    const existingMood = await getTodaySkinMood()
    targetMoodId = existingMood?.id ?? null
  }

  if (targetMoodId) {
    const { error } = await supabase
      .from('skin_moods')
      .update({ moods })
      .eq('id', targetMoodId)
      .eq('user_id', user.id)

    if (error) {
      if (error.code === '42501') {
        throw new Error('RLS_BLOCKED')
      }

      throw error
    }

    return {
      action: 'updated',
      recordId: targetMoodId
    }
  }

  const { error } = await supabase.from('skin_moods').insert({
    user_id: user.id,
    moods
  })

  if (error) {
    if (error.code === '42501') {
      throw new Error('RLS_BLOCKED')
    }

    if (error.code === '23505') {
      throw new Error('DAILY_MOOD_ALREADY_EXISTS')
    }

    throw error
  }

  const createdMood = await getTodaySkinMood()

  return {
    action: 'created',
    recordId: createdMood?.id ?? ''
  }
}
