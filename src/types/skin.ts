export type SkinMood =
  | 'normal'
  | 'dry'
  | 'oily'
  | 'acneic'
  | 'irritated'
  | 'dull'

export interface SkinMoodOption {
  value: SkinMood
  label: string
  description: string
}

export function normalizeSkinMood(value: string): SkinMood | null {
  switch (value) {
    case 'normal':
      return 'normal'
    case 'dry':
      return 'dry'
    case 'oily':
      return 'oily'
    case 'acneic':
    case 'acne':
      return 'acneic'
    case 'irritated':
    case 'sensitive':
      return 'irritated'
    case 'dull':
      return 'dull'
    default:
      return null
  }
}

export const SKIN_MOOD_OPTIONS: SkinMoodOption[] = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'Pele est\u00E1vel, confort\u00E1vel e sem excessos.'
  },
  {
    value: 'dry',
    label: 'Ressecada',
    description: 'Pele seca, repuxando ou com toque \u00E1spero.'
  },
  {
    value: 'oily',
    label: 'Oleosa',
    description: 'Brilho e excesso de oleosidade ao longo do dia.'
  },
  {
    value: 'acneic',
    label: 'Acneica',
    description: 'Cravos, espinhas ou inflama\u00E7\u00F5es em evid\u00EAncia.'
  },
  {
    value: 'irritated',
    label: 'Irritada',
    description: 'Sensa\u00E7\u00E3o de ardor, vermelhid\u00E3o ou desconforto.'
  },
  {
    value: 'dull',
    label: 'Opaca',
    description: 'Sem vi\u00E7o, com apar\u00EAncia cansada ou sem brilho.'
  }
]
