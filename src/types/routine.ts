import { Product } from './product'

export interface RoutineItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product; 
  period: 'am' | 'pm';
  order: number;
  is_completed?: boolean; 
}

export interface RoutineRecord {
  id: string
  user_id: string
  period: 'diurna' | 'noturna' 
  products: Product[]
  created_at: string
}