import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  height: number | null;
  weight: number | null;
  bmi: number | null;
  health_goal: string | null;
  badges: string[];
  credits: number;
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

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<SustainabilityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      
      const { data: statsData, error: statsError } = await supabase
        .from('sustainability_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError) throw statsError;
      
      setProfile(profileData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast.success('Profile updated');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return { data: null, error };
    }
  };

  const updateStats = async (updates: Partial<SustainabilityStats>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('sustainability_stats')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setStats(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating stats:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    stats,
    loading,
    updateProfile,
    updateStats,
    refetch: fetchProfile,
  };
};