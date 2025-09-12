import { useState, useEffect } from 'react';
import { supabase, type UserProfile, type SustainabilityStats } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<SustainabilityStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile and stats
  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('sustainability_stats')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ]);

      // Create profile if doesn't exist
      if (profileRes.error && profileRes.error.code === 'PGRST116') {
        await createProfile();
      } else if (profileRes.data) {
        setProfile(profileRes.data);
      }

      // Create stats if doesn't exist
      if (statsRes.error && statsRes.error.code === 'PGRST116') {
        await createStats();
      } else if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new profile
  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          credits: 0,
          badges: []
        }])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  // Create new stats
  const createStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sustainability_stats')
        .insert([{
          user_id: user.id,
          total_items: 0,
          items_used: 0,
          items_donated: 0,
          items_sold: 0,
          co2_saved: 0,
          food_saved_kg: 0
        }])
        .select()
        .single();

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error creating stats:', error);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { success: false, error: 'No profile found' };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return { success: false, error };
    }
  };

  // Calculate and update BMI
  const updateBMI = async (height: number, weight: number) => {
    if (!height || !weight) return;

    const heightInMeters = height / 100;
    const bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;

    return updateProfile({ height, weight, bmi });
  };

  // Add credits
  const addCredits = async (amount: number) => {
    if (!profile) return;

    const newCredits = profile.credits + amount;
    await updateProfile({ credits: newCredits });
  };

  // Update sustainability stats
  const updateStats = async (updates: Partial<SustainabilityStats>) => {
    if (!user || !stats) return { success: false, error: 'No stats found' };

    try {
      const { data, error } = await supabase
        .from('sustainability_stats')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setStats(data);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating stats:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    stats,
    loading,
    updateProfile,
    updateBMI,
    addCredits,
    updateStats,
    refetch: fetchProfile
  };
};