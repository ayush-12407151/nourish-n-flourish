import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Package, 
  Leaf, 
  Award, 
  TrendingUp,
  Plus,
  Clock,
  ChefHat,
  Recycle
} from 'lucide-react';

const Dashboard = () => {
  // Mock data - replace with real data from your backend
  const stats = {
    pantryItems: 23,
    itemsUsed: 156,
    co2Saved: '45.2',
    creditsEarned: 1280,
    expiringItems: 3,
    recipesCreated: 8,
  };

  const recentActivity = [
    { action: 'Used leftover rice for fried rice', time: '2 hours ago', type: 'use' },
    { action: 'Added fresh vegetables to pantry', time: '1 day ago', type: 'add' },
    { action: 'Donated excess bread to food bank', time: '2 days ago', type: 'donate' },
  ];

  const badges = [
    { name: 'Leftover Hero', description: 'Used 50+ leftover items', earned: true },
    { name: 'Green Guardian', description: 'Saved 100kg CO2', earned: true },
    { name: 'Waste Warrior', description: 'Zero waste for 7 days', earned: false },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Alex! 🌱</h1>
        <p className="text-muted-foreground">Here's your sustainability impact overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pantry Items"
          value={stats.pantryItems}
          description="Active items in pantry"
          icon={Package}
          variant="default"
        />
        <StatsCard
          title="Items Used"
          value={stats.itemsUsed}
          description="Total items repurposed"
          icon={Recycle}
          variant="success"
          trend="up"
          trendValue="+12 this week"
        />
        <StatsCard
          title="CO₂ Saved"
          value={`${stats.co2Saved}kg`}
          description="Environmental impact"
          icon={Leaf}
          variant="fresh"
          trend="up"
          trendValue="+5.2kg this month"
        />
        <StatsCard
          title="Credits Earned"
          value={stats.creditsEarned}
          description="Sustainability points"
          icon={Award}
          variant="harvest"
          trend="up"
          trendValue="+85 this week"
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="hero" className="h-auto py-4 flex-col gap-2">
              <Plus className="h-5 w-5" />
              <span>Add Pantry Item</span>
            </Button>
            <Button variant="fresh" className="h-auto py-4 flex-col gap-2">
              <ChefHat className="h-5 w-5" />
              <span>Get Recipe Ideas</span>
            </Button>
          </div>
        </Card>

        {/* Expiring Items Alert */}
        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-foreground">Expiring Soon</h3>
          </div>
          <p className="text-2xl font-bold text-warning mb-2">{stats.expiringItems} items</p>
          <p className="text-sm text-muted-foreground mb-4">Need attention within 3 days</p>
          <Button variant="warning" size="sm" className="w-full">
            View Items
          </Button>
        </Card>
      </div>

      {/* Recent Activity & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`p-2 rounded-full ${
                  activity.type === 'use' ? 'bg-success/20 text-success' :
                  activity.type === 'add' ? 'bg-primary/20 text-primary' :
                  'bg-harvest/20 text-harvest'
                }`}>
                  {activity.type === 'use' ? <ChefHat className="h-4 w-4" /> :
                   activity.type === 'add' ? <Plus className="h-4 w-4" /> :
                   <Recycle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Achievement Badges</h2>
          <div className="space-y-3">
            {badges.map((badge, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${
                badge.earned 
                  ? 'bg-success/10 border-success/20' 
                  : 'bg-muted/30 border-border'
              }`}>
                <div className={`p-2 rounded-full ${
                  badge.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    badge.earned ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
                {badge.earned && <TrendingUp className="h-4 w-4 text-success" />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;