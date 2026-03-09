export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  skin_type:| 'oleosa'| 'seca'| 'mista'| 'acnéica'| 'madura'| 'normal'| 'sensivel'| null 
  created_at?: string
  updated_at?: string
}
