import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development: use placeholder values if env vars aren't set
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-anon-key';

console.log('Supabase config:', { 
  hasUrl: !!supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  url: url.substring(0, 20) + '...'
});

export const supabase = createClient(url, key);

// Database types
export interface PantryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  category: string;
  status: 'fresh' | 'expiring' | 'expired' | 'used' | 'donated' | 'sold';
  created_at: string;
  updated_at: string;
}

export interface DonationRecord {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  organization: string;
  contact_info?: string;
  notes?: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface SellRecord {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  price: number;
  platform: string;
  description?: string;
  contact_method?: string;
  status: 'listed' | 'sold' | 'cancelled';
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  height?: number;
  weight?: number;
  bmi?: number;
  health_goal?: 'fat_loss' | 'maintenance' | 'muscle_gain';
  credits: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface SustainabilityStats {
  id: string;
  user_id: string;
  total_items: number;
  items_used: number;
  items_donated: number;
  items_sold: number;
  co2_saved: number;
  food_saved_kg: number;
  created_at: string;
  updated_at: string;
}