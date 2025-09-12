import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  DollarSign, 
  CheckCircle,
  Package,
  Search
} from 'lucide-react';
import { useDonateSell } from '@/hooks/useDonateSell';
import { usePantry } from '@/hooks/usePantry';

const DonateSell = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const { donations, sales, loading } = useDonateSell();
  const { items } = usePantry();

  const availableItems = items.filter(item => 
    item.status === 'fresh' || item.status === 'expiring'
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Donate & Sell</h1>
        <p className="text-muted-foreground">Share surplus food and reduce waste while helping others</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="donated">Donated</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableItems.map((item) => (
              <Card key={item.id} className="p-4 hover:shadow-medium transition-spring">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Quantity: <span className="font-medium text-foreground">{item.quantity} {item.unit}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(item.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="fresh" className="flex-1 text-xs">
                      <Gift className="h-3 w-3 mr-1" />
                      Donate
                    </Button>
                    <Button size="sm" variant="harvest" className="flex-1 text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Sell
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donated" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((item) => (
              <Card key={item.id} className="p-4 border-success/30 bg-success/5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-success" />
                      <span className="font-medium text-foreground">{item.item_name}</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Donated to: <span className="font-medium text-foreground">{item.organization}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sold" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sales.map((item) => (
              <Card key={item.id} className="p-4 border-warning/30 bg-warning/5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-warning" />
                      <span className="font-medium text-foreground">{item.item_name}</span>
                    </div>
                    <span className="text-sm font-medium text-success">${item.price}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Platform: <span className="font-medium text-foreground">{item.platform}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonateSell;