import { createClient } from '@/lib/supabase/client'

export interface ProfileUpdatePayload {
  full_name: string
  avatar_url: string
  birth_date: string
  goal: string
  skin_type: string[]
  concerns: string[]
}

function normalizeText(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeArray(values: string[]) {
  const normalized = Array.from(
    new Set(values.map(item => item.trim()).filter(Boolean))
  )

  return normalized.length > 0 ? normalized : null
}

export async function updateProfile(userId: string, payload: ProfileUpdatePayload) {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: normalizeText(payload.full_name),
      avatar_url: normalizeText(payload.avatar_url),
      birth_date: normalizeText(payload.birth_date),
      goal: normalizeText(payload.goal),
      skin_type: normalizeArray(payload.skin_type),
      concerns: normalizeArray(payload.concerns)
    })
    .eq('id', userId)

  if (error) {
    throw error
  }
}

export async function updateProfileAvatar(file: File) {
  const supabase = createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Usuário não autenticado')
  }

  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type
    })

  if (uploadError) {
    throw uploadError
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from('products').getPublicUrl(fileName)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) {
    throw updateError
  }

  return publicUrl
}

export async function removeProfileAvatar() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id)

  if (error) {
    throw error
  }
}
