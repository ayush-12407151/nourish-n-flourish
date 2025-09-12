import { useState, useEffect } from 'react';
import { supabase, type DonationRecord, type SellRecord } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { usePantry } from './usePantry';
import { toast } from 'sonner';

export const useDonateSell = () => {
  const { user } = useAuth();
  const { updateItemStatus } = usePantry();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [sales, setSales] = useState<SellRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch donations and sales
  const fetchRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [donationsRes, salesRes] = await Promise.all([
        supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('sales')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (donationsRes.error) throw donationsRes.error;
      if (salesRes.error) throw salesRes.error;

      setDonations(donationsRes.data || []);
      setSales(salesRes.data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load donation/sale records');
    } finally {
      setLoading(false);
    }
  };

  // Create donation record
  const createDonation = async (donationData: {
    itemId: string;
    itemName: string;
    organization: string;
    contactInfo?: string;
    notes?: string;
  }) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          user_id: user.id,
          item_id: donationData.itemId,
          item_name: donationData.itemName,
          organization: donationData.organization,
          contact_info: donationData.contactInfo,
          notes: donationData.notes,
          status: 'completed'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update pantry item status
      await updateItemStatus(donationData.itemId, 'donated');
      
      setDonations(prev => [data, ...prev]);
      toast.success('Item donated successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Failed to record donation');
      return { success: false, error };
    }
  };

  // Create sale record
  const createSale = async (saleData: {
    itemId: string;
    itemName: string;
    price: number;
    platform: string;
    description?: string;
    contactMethod?: string;
  }) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          user_id: user.id,
          item_id: saleData.itemId,
          item_name: saleData.itemName,
          price: saleData.price,
          platform: saleData.platform,
          description: saleData.description,
          contact_method: saleData.contactMethod,
          status: 'sold'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update pantry item status
      await updateItemStatus(saleData.itemId, 'sold');
      
      setSales(prev => [data, ...prev]);
      toast.success('Item sold successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Failed to record sale');
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  return {
    donations,
    sales,
    loading,
    createDonation,
    createSale,
    refetch: fetchRecords
  };
};