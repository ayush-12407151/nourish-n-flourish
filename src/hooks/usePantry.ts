import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PantryItem } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const usePantry = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pantry items
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
      setItems((data as unknown as PantryItem[]) || []);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
      toast.error('Failed to load pantry items');
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (itemData: Omit<PantryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Calculate status based on expiry date
      const expiryDate = new Date(itemData.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: PantryItem['status'] = 'fresh';
      if (daysUntilExpiry <= 0) status = 'expired';
      else if (daysUntilExpiry <= 3) status = 'expiring';

      const { data, error } = await supabase
        .from('pantry_items')
        .insert([{
          ...itemData,
          user_id: user.id,
          status
        }])
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data as unknown as PantryItem, ...prev]);
      toast.success('Item added to pantry');
      return { success: true, data };
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
      return { success: false, error };
    }
  };

  // Update item status
  const updateItemStatus = async (itemId: string, status: PantryItem['status']) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('pantry_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false, error };
    }
  };

  // Delete item
  const deleteItem = async (itemId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from pantry');
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to remove item');
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  return {
    items,
    loading,
    addItem,
    updateItemStatus,
    deleteItem,
    refetch: fetchItems
  };
};