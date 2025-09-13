import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useProfile } from '@/hooks/useProfile';
import { usePantry } from '@/hooks/usePantry';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ChefHat, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Award,
  Leaf,
  Recycle,
  Users,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, stats, loading: profileLoading } = useProfile();
  const { items, loading: pantryLoading } = usePantry();
  const navigate = useNavigate();

  const loading = profileLoading || pantryLoading;

  // Calculate expiring items
  const expiringItems = items.filter(item => item.status === 'expiring' || item.status === 'expired');
  
  // Mock activity data
  const recentActivity = [
    { id: 1, action: 'Added organic tomatoes to pantry', time: '2 hours ago', type: 'add' },
    { id: 2, action: 'Used avocados for guacamole recipe', time: '5 hours ago', type: 'use' },
    { id: 3, action: 'Donated bread to local food bank', time: '1 day ago', type: 'donate' },
    { id: 4, action: 'Earned "Waste Warrior" badge', time: '2 days ago', type: 'achievement' },
  ];

  const achievementBadges = [
    { id: 1, name: 'First Steps', description: 'Added your first pantry item', earned: true },
    { id: 2, name: 'Eco Warrior', description: 'Saved 10kg of food from waste', earned: (profile?.credits || 0) > 50 },
    { id: 3, name: 'Community Helper', description: 'Donated 5 times to charity', earned: false },
    { id: 4, name: 'Recipe Master', description: 'Used 20 pantry items in recipes', earned: false },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'there'}! 🌱
          </h1>
          <p className="text-muted-foreground">Here's your sustainability impact overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pantry Items"
          value={items.length.toString()}
          description="Items in your pantry"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Items Used"
          value={stats?.items_used?.toString() || '0'}
          description="Items used this month"
          icon={ChefHat}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="CO₂ Saved"
          value={`${stats?.co2_saved?.toFixed(1) || '0.0'}kg`}
          description="Carbon footprint reduced"
          icon={Leaf}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Credits Earned"
          value={(profile?.credits || 0).toString()}
          description="Sustainability points"
          icon={Award}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" variant="hero" onClick={() => navigate('/pantry')}>
            <Plus className="h-4 w-4" />
            Add Pantry Item
          </Button>
          <Button variant="earth" className="gap-2" onClick={() => navigate('/reimaginer')}>
            <ChefHat className="h-4 w-4" />
            Get Recipe Ideas
          </Button>
        </div>
      </Card>

      {/* Expiring Items Alert */}
      {expiringItems.length > 0 && (
        <Card className="p-4 border-warning/30 bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Items Expiring Soon</h3>
              <p className="text-sm text-muted-foreground">
                You have {expiringItems.length} item{expiringItems.length > 1 ? 's' : ''} expiring soon.
              </p>
              <div className="flex flex-wrap gap-2">
                {expiringItems.slice(0, 3).map((item) => (
                  <Badge key={item.id} variant="secondary" className="text-xs">
                    {item.name}
                  </Badge>
                ))}
              </div>
              <Button variant="warning" size="sm" onClick={() => navigate('/pantry')}>
                View Pantry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Achievement Badges</h2>
          <div className="space-y-3">
            {achievementBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Award className={`h-5 w-5 ${badge.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
                {badge.earned && <Badge variant="success" className="text-xs">Earned</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;