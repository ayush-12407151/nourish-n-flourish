import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Package, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  HandHeart,
  Utensils,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CameraScanner from '@/components/CameraScanner';
import DonateSellDialog from '@/components/DonateSellDialog';
import { usePantry, PantryItem } from '@/hooks/usePantry';
import { useDonateSell } from '@/hooks/useDonateSell';
import { toast } from 'sonner';

const Pantry = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [donateSellDialog, setDonateSellDialog] = useState<{
    isOpen: boolean;
    itemId: string;
    itemName: string;
  }>({ isOpen: false, itemId: '', itemName: '' });
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    expiry_date: '',
    category: 'vegetables'
  });

  const { items, loading, addItem } = usePantry();
  const { createDonation, createSale } = useDonateSell();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'border-success/30 bg-success/5';
      case 'expiring': return 'border-warning/30 bg-warning/5';
      case 'expired': return 'border-destructive/30 bg-destructive/5';
      default: return 'border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'expiring': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'expired': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await addItem({
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      expiry_date: newItem.expiry_date,
      category: newItem.category
    });

    if (result?.data) {
      setIsAddDialogOpen(false);
      setNewItem({
        name: '',
        quantity: 1,
        unit: 'pieces',
        expiry_date: '',
        category: 'vegetables'
      });
    }
  };

  const handleScanComplete = (extractedText: string) => {
    // Parse the extracted text and auto-fill the form
    const lines = extractedText.split('\n').filter(line => line.trim());
    
    // Simple parsing logic - you can enhance this
    if (lines.length > 0) {
      setNewItem(prev => ({
        ...prev,
        name: lines[0] // Use first line as item name
      }));
      setIsAddDialogOpen(true);
    }
  };

  const handleUseItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Navigate to reimaginer with the item name as context
      navigate(`/reimaginer?item=${encodeURIComponent(item.name)}`);
    }
  };

  const handleDonateSell = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setDonateSellDialog({
        isOpen: true,
        itemId,
        itemName: item.name
      });
    }
  };

  const handleDonateSellComplete = async (action: 'donate' | 'sell', details: any) => {
    const item = items.find(i => i.id === donateSellDialog.itemId);
    if (!item) return;

    if (action === 'donate') {
      await createDonation({
        item_id: donateSellDialog.itemId,
        item_name: donateSellDialog.itemName,
        organization: details.organization,
        contact_info: details.contactInfo,
        notes: details.notes
      });
    } else {
      await createSale({
        item_id: donateSellDialog.itemId,
        item_name: donateSellDialog.itemName,
        price: parseFloat(details.price),
        platform: details.platform,
        description: details.description,
        contact_method: details.contactMethod
      });
    }
    
    setDonateSellDialog({ isOpen: false, itemId: '', itemName: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Pantry Tracker</h1>
          <p className="text-muted-foreground">Manage your food inventory and reduce waste</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Pantry Item</DialogTitle>
              <DialogDescription>
                Add a new item to your pantry inventory
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Organic Tomatoes"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="g">Grams</option>
                    <option value="liters">Liters</option>
                    <option value="ml">Milliliters</option>
                    <option value="containers">Containers</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={newItem.expiry_date}
                  onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="dairy">Dairy</option>
                  <option value="grains">Grains</option>
                  <option value="meat">Meat</option>
                  <option value="bakery">Bakery</option>
                  <option value="pantry">Pantry Staples</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <CameraScanner onScanComplete={handleScanComplete} />
                <Button onClick={handleAddItem} variant="hero" className="flex-1">
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pantry items..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Pantry Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className={cn(
            "p-4 hover:shadow-medium transition-spring",
            getStatusColor(item.status)
          )}>
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground text-sm">{item.name}</span>
                </div>
                {getStatusIcon(item.status)}
              </div>
              
              {/* Details */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Quantity: <span className="font-medium text-foreground">{item.quantity} {item.unit}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Expires: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'No expiry'}</span>
                  </div>
                </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="success" 
                  className="flex-1 text-xs"
                  onClick={() => handleUseItem(item.id)}
                >
                  <Utensils className="h-3 w-3 mr-1" />
                  Use
                </Button>
                <Button 
                  size="sm" 
                  variant="fresh" 
                  className="flex-1 text-xs"
                  onClick={() => handleDonateSell(item.id)}
                >
                  <HandHeart className="h-3 w-3 mr-1" />
                  Donate/Sell
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pantry items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search' : 'Add your first pantry item to get started'}
          </p>
        </div>
      ) : null}

      {/* Donate/Sell Dialog */}
      <DonateSellDialog
        isOpen={donateSellDialog.isOpen}
        onClose={() => setDonateSellDialog({ isOpen: false, itemId: '', itemName: '' })}
        itemName={donateSellDialog.itemName}
        onComplete={handleDonateSellComplete}
      />
    </div>
  );
};

export default Pantry;