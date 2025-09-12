import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Award, 
  Settings, 
  Camera,
  Calendar,
  Target,
  TrendingUp,
  Leaf,
  Package,
  ChefHat,
  Gift,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Profile = () => {
  // Mock user data - replace with real data
  const userProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    joinDate: '2024-03-15',
    location: 'San Francisco, CA',
    bio: 'Passionate about sustainable living and reducing food waste. Love experimenting with new recipes!',
    stats: {
      bmi: 23.2,
      healthGoal: 'Maintenance',
      credits: 1280,
      level: 'Sustainability Champion',
      streak: 15
    }
  };

  const achievements = [
    { 
      id: 1,
      name: 'Leftover Hero',
      description: 'Used 50+ leftover items',
      icon: ChefHat,
      earned: true,
      progress: 100,
      earnedDate: '2024-11-20'
    },
    {
      id: 2, 
      name: 'Green Guardian',
      description: 'Saved 100kg CO₂',
      icon: Leaf,
      earned: true,
      progress: 100,
      earnedDate: '2024-12-05'
    },
    {
      id: 3,
      name: 'Waste Warrior',
      description: 'Zero waste for 7 consecutive days',
      icon: Package,
      earned: false,
      progress: 85,
      earnedDate: null
    },
    {
      id: 4,
      name: 'Community Helper',
      description: 'Donated 25+ items',
      icon: Gift,
      earned: true,
      progress: 100,
      earnedDate: '2024-12-20'
    }
  ];

  const recentActivity = [
    { action: 'Created Mediterranean Rice Bowl recipe', date: '2 hours ago', type: 'recipe' },
    { action: 'Added 5 new pantry items', date: '1 day ago', type: 'pantry' },
    { action: 'Earned "Green Guardian" badge', date: '3 days ago', type: 'achievement' },
    { action: 'Donated excess vegetables', date: '5 days ago', type: 'donation' },
    { action: 'Completed weekly meal plan', date: '1 week ago', type: 'planning' }
  ];

  const impactStats = [
    { label: 'Items Saved', value: '156', icon: Package, trend: '+12 this week' },
    { label: 'CO₂ Reduced', value: '45.2kg', icon: Leaf, trend: '+3.1kg this month' },
    { label: 'Money Saved', value: '$240', icon: TrendingUp, trend: '+$18 this week' },
    { label: 'Recipes Created', value: '23', icon: ChefHat, trend: '+3 this week' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'recipe': return ChefHat;
      case 'pantry': return Package;
      case 'achievement': return Award;
      case 'donation': return Gift;
      case 'planning': return Calendar;
      default: return User;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'recipe': return 'text-harvest bg-harvest/10';
      case 'pantry': return 'text-primary bg-primary/10';
      case 'achievement': return 'text-success bg-success/10';
      case 'donation': return 'text-accent-vibrant bg-accent-vibrant/10';
      case 'planning': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account and track your sustainability journey</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <button className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border border-border shadow-sm hover:shadow-md transition-shadow">
                  <Camera className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-foreground">{userProfile.name}</h2>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                <p className="text-sm text-muted-foreground">{userProfile.location}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Award className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">{userProfile.stats.level}</span>
                </div>
              </div>
              
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{userProfile.bio}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium text-foreground">
                  {new Date(userProfile.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Current streak</span>
                <span className="font-medium text-foreground">{userProfile.stats.streak} days</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Credits earned</span>
                <span className="font-medium text-harvest">{userProfile.stats.credits}</span>
              </div>
            </div>
          </Card>

          {/* Health Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Health Profile
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">BMI</span>
                <span className="font-medium text-success">{userProfile.stats.bmi} (Normal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Health Goal</span>
                <span className="font-medium text-foreground">{userProfile.stats.healthGoal}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Impact Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-4 text-center hover:shadow-medium transition-spring">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mb-2">{stat.label}</div>
                  <div className="text-xs text-success">{stat.trend}</div>
                </Card>
              );
            })}
          </div>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={achievement.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      achievement.earned 
                        ? "bg-success/5 border-success/20" 
                        : "bg-muted/30 border-border"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        achievement.earned 
                          ? "bg-success text-success-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className={cn(
                            "font-medium text-sm",
                            achievement.earned ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {achievement.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        
                        {achievement.earned ? (
                          <p className="text-xs text-success font-medium">
                            Earned on {new Date(achievement.earnedDate!).toLocaleDateString()}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{achievement.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-primary rounded-full h-1.5 transition-all"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className={cn("p-2 rounded-full", getActivityColor(activity.type))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;