export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  usage_frequency: 'am' | 'pm' | 'both' | string; 
  status: 'closed' | 'open' | 'finished';
  quantity: number;
  price: number | null;
  opened_at: string | null;
  expiry_date: string | null;
  image_url: string | null;
  review: string | null;
  is_favorite: boolean;
    created_at?: string;
  user_id?: string;
}