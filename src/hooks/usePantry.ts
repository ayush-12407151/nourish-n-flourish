import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PantryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  category: string;
  status: 'fresh' | 'expiring' | 'expired';
  created_at: string;
  updated_at: string;
}

export const usePantry = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate status based on expiry date
      const itemsWithStatus = (data || []).map(item => ({
        ...item,
        status: calculateStatus(item.expiry_date) as 'fresh' | 'expiring' | 'expired'
      }));
      
      setItems(itemsWithStatus);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
      toast.error('Failed to load pantry items');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatus = (expiryDate: string | null): string => {
    if (!expiryDate) return 'fresh';
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'expiring';
    return 'fresh';
  };

  const addItem = async (itemData: {
    name: string;
    quantity: number;
    unit: string;
    expiry_date: string;
    category: string;
  }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .insert([{
          ...itemData,
          user_id: user.id,
          status: calculateStatus(itemData.expiry_date)
        }])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast.success('Item added to pantry');
      return { data, error: null };
    } catch (error) {
      console.error('Error adding pantry item:', error);
      toast.error('Failed to add item');
      return { data: null, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<PantryItem>) => {
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));
      toast.success('Item updated');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating pantry item:', error);
      toast.error('Failed to update item');
      return { data: null, error };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item removed from pantry');
      return { error: null };
    } catch (error) {
      console.error('Error deleting pantry item:', error);
      toast.error('Failed to remove item');
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};