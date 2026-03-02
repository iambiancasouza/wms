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