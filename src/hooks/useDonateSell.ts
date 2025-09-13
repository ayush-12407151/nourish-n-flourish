import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface DonationRecord {
  id: string;
  user_id: string;
  item_id: string | null;
  item_name: string;
  organization: string;
  contact_info: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export interface SellRecord {
  id: string;
  user_id: string;
  item_id: string | null;
  item_name: string;
  price: number;
  platform: string;
  description: string | null;
  contact_method: string | null;
  status: string;
  created_at: string;
}

export const useDonateSell = () => {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [sales, setSales] = useState<SellRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [donationsResult, salesResult] = await Promise.all([
        supabase
          .from('donation_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('sell_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (donationsResult.error) throw donationsResult.error;
      if (salesResult.error) throw salesResult.error;
      
      setDonations(donationsResult.data || []);
      setSales(salesResult.data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donationData: {
    item_id?: string;
    item_name: string;
    organization: string;
    contact_info: string;
    notes: string;
  }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('donation_records')
        .insert([{
          ...donationData,
          user_id: user.id,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setDonations(prev => [data, ...prev]);
      toast.success('Donation record created');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Failed to create donation record');
      return { data: null, error };
    }
  };

  const createSale = async (saleData: {
    item_id?: string;
    item_name: string;
    price: number;
    platform: string;
    description: string;
    contact_method: string;
  }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('sell_records')
        .insert([{
          ...saleData,
          user_id: user.id,
          status: 'listed'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSales(prev => [data, ...prev]);
      toast.success('Sale record created');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Failed to create sale record');
      return { data: null, error };
    }
  };

  const updateDonationStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('donation_records')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDonations(prev => prev.map(donation => 
        donation.id === id ? { ...donation, status } : donation
      ));
      toast.success('Donation status updated');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error('Failed to update donation');
      return { data: null, error };
    }
  };

  const updateSaleStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('sell_records')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSales(prev => prev.map(sale => 
        sale.id === id ? { ...sale, status } : sale
      ));
      toast.success('Sale status updated');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Failed to update sale');
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  return {
    donations,
    sales,
    loading,
    createDonation,
    createSale,
    updateDonationStatus,
    updateSaleStatus,
    refetch: fetchRecords,
  };
};