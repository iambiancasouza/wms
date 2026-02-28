export interface Procedure {
  id: string;
  name: string;
  clinic_professional: string | null;
  date: string; 
  price: number | null;
  notes: string | null;
  next_session: string | null; 
  image_url: string | null; // Foto do antes/depois
  created_at?: string;
  user_id?: string;
}