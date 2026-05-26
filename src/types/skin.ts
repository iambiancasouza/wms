export type SkinMood =
  | 'normal'
  | 'dry'
  | 'oily'
  | 'acneic'
  | 'sensitive'
  | 'dull'

export interface SkinMoodOption {
  value: SkinMood
  label: string
  description: string
}

export function normalizeSkinMood(value: string): SkinMood | null {
  switch (value) {
    case 'normal':
    case 'good':
      return 'normal'
    case 'dry':
      return 'dry'
    case 'oily':
      return 'oily'
    case 'acneic':
    case 'acne':
      return 'acneic'
    case 'sensitive':
    case 'irritated':
      return 'sensitive'
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
    description: 'Pele estável, confortável e sem excessos.'
  },
  {
    value: 'dry',
    label: 'Ressecada',
    description: 'Pele seca, repuxando ou com toque áspero.'
  },
  {
    value: 'oily',
    label: 'Oleosa',
    description: 'Brilho e excesso de oleosidade ao longo do dia.'
  },
  {
    value: 'acneic',
    label: 'Acneica',
    description: 'Cravos, espinhas ou inflamações em evidência.'
  },
  {
    value: 'sensitive',
    label: 'Sensível',
    description: 'Ardor, vermelhidão ou descamação.'
  },
  {
    value: 'dull',
    label: 'Opaca',
    description: 'Sem viço, com aparência cansada ou sem brilho.'
  }
]
