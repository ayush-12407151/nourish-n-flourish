import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, DollarSign, MapPin, Phone, Mail } from 'lucide-react';

interface DonateSellDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onComplete: (action: 'donate' | 'sell', details: any) => void;
}

const DonateSellDialog = ({ isOpen, onClose, itemName, onComplete }: DonateSellDialogProps) => {
  const [donateForm, setDonateForm] = useState({
    organization: '',
    contactInfo: '',
    notes: ''
  });

  const [sellForm, setSellForm] = useState({
    price: '',
    platform: 'local',
    description: '',
    contactMethod: 'phone'
  });

  const handleDonate = () => {
    onComplete('donate', donateForm);
    onClose();
    // Reset form
    setDonateForm({ organization: '', contactInfo: '', notes: '' });
  };

  const handleSell = () => {
    onComplete('sell', sellForm);
    onClose();
    // Reset form
    setSellForm({ price: '', platform: 'local', description: '', contactMethod: 'phone' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Donate or Sell: {itemName}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="donate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donate" className="gap-2">
              <Gift className="h-4 w-4" />
              Donate
            </TabsTrigger>
            <TabsTrigger value="sell" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization/Charity</Label>
                <Input
                  id="organization"
                  placeholder="e.g., Local Food Bank"
                  value={donateForm.organization}
                  onChange={(e) => setDonateForm({...donateForm, organization: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  placeholder="Phone or address"
                  value={donateForm.contactInfo}
                  onChange={(e) => setDonateForm({...donateForm, contactInfo: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions..."
                  value={donateForm.notes}
                  onChange={(e) => setDonateForm({...donateForm, notes: e.target.value})}
                />
              </div>

              <Button onClick={handleDonate} className="w-full" variant="fresh">
                <Gift className="h-4 w-4 mr-2" />
                Confirm Donation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={sellForm.price}
                  onChange={(e) => setSellForm({...sellForm, price: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={sellForm.platform}
                  onChange={(e) => setSellForm({...sellForm, platform: e.target.value})}
                >
                  <option value="local">Local Community</option>
                  <option value="facebook">Facebook Marketplace</option>
                  <option value="craigslist">Craigslist</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item condition, etc."
                  value={sellForm.description}
                  onChange={(e) => setSellForm({...sellForm, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                <select
                  id="contactMethod"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={sellForm.contactMethod}
                  onChange={(e) => setSellForm({...sellForm, contactMethod: e.target.value})}
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="message">Text Message</option>
                </select>
              </div>

              <Button onClick={handleSell} className="w-full" variant="harvest">
                <DollarSign className="h-4 w-4 mr-2" />
                List for Sale
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DonateSellDialog;