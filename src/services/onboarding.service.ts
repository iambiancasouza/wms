import { createClient } from '@/lib/supabase/client'

interface OnboardingData {
  birth_date: string 
  skin_type: string[]
  concerns: string[]
}

export async function saveOnboarding(data: OnboardingData) {
  const supabase = createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('profiles')
    .update({
      birth_date: data.birth_date, 
      skin_type: data.skin_type, 
      concerns: data.concerns, 
      onboarding_completed: true
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }
}