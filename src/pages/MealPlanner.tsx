import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Calculator, 
  Target, 
  ShoppingCart, 
  ChefHat,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Clock,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MealPlan {
  day: string;
  date: string;
  meals: {
    breakfast: { name: string; calories: number; fromPantry: boolean };
    lunch: { name: string; calories: number; fromPantry: boolean };
    dinner: { name: string; calories: number; fromPantry: boolean };
    snack?: { name: string; calories: number; fromPantry: boolean };
  };
}

const MealPlanner = () => {
  const [userStats, setUserStats] = useState({
    height: '',
    weight: '',
    age: '28',
    gender: 'female',
    activityLevel: 'moderate',
    goal: 'maintenance'
  });
  
  const [bmiCalculated, setBmiCalculated] = useState(false);
  const [bmi, setBmi] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(0);

  // Mock meal plans - replace with real data
  const [mealPlans] = useState<MealPlan[]>([
    {
      day: 'Monday',
      date: '2025-01-13',
      meals: {
        breakfast: { name: 'Overnight Oats with Berries', calories: 320, fromPantry: true },
        lunch: { name: 'Quinoa Salad Bowl', calories: 450, fromPantry: true },
        dinner: { name: 'Grilled Chicken with Roasted Vegetables', calories: 520, fromPantry: false },
        snack: { name: 'Greek Yogurt with Nuts', calories: 180, fromPantry: true }
      }
    },
    {
      day: 'Tuesday', 
      date: '2025-01-14',
      meals: {
        breakfast: { name: 'Vegetable Scramble', calories: 290, fromPantry: true },
        lunch: { name: 'Leftover Rice Stir-fry', calories: 380, fromPantry: true },
        dinner: { name: 'Lentil Curry with Brown Rice', calories: 480, fromPantry: true }
      }
    },
    {
      day: 'Wednesday',
      date: '2025-01-15', 
      meals: {
        breakfast: { name: 'Smoothie Bowl', calories: 340, fromPantry: false },
        lunch: { name: 'Pantry Pasta Salad', calories: 420, fromPantry: true },
        dinner: { name: 'Stuffed Bell Peppers', calories: 460, fromPantry: true }
      }
    }
  ]);

  const calculateBMI = () => {
    if (!userStats.height || !userStats.weight) return;
    
    const heightInM = parseFloat(userStats.height) / 100;
    const weightInKg = parseFloat(userStats.weight);
    const calculatedBMI = weightInKg / (heightInM * heightInM);
    
    setBmi(Math.round(calculatedBMI * 10) / 10);
    
    // Calculate daily calories based on BMI and goals (simplified formula)
    let baseCalories = 1800; // Base for moderate activity female
    if (userStats.gender === 'male') baseCalories = 2200;
    
    switch (userStats.goal) {
      case 'fat_loss':
        setDailyCalories(Math.round(baseCalories * 0.85));
        break;
      case 'muscle_gain':
        setDailyCalories(Math.round(baseCalories * 1.15));
        break;
      default:
        setDailyCalories(baseCalories);
    }
    
    setBmiCalculated(true);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-warning' };
    if (bmi < 25) return { category: 'Normal', color: 'text-success' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-warning' };
    return { category: 'Obese', color: 'text-destructive' };
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'fat_loss': return <TrendingDown className="h-4 w-4" />;
      case 'muscle_gain': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTotalCalories = (meals: any) => {
    return meals.breakfast.calories + meals.lunch.calories + meals.dinner.calories + (meals.snack?.calories || 0);
  };

  const getPantryPercentage = (meals: any) => {
    const totalMeals = meals.snack ? 4 : 3;
    const pantryMeals = [meals.breakfast, meals.lunch, meals.dinner, meals.snack]
      .filter(meal => meal && meal.fromPantry).length;
    return Math.round((pantryMeals / totalMeals) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Meal Planner</h1>
        <p className="text-muted-foreground">Plan your meals based on your health goals and pantry items</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* BMI Calculator & Goals */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              BMI Calculator
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={userStats.height}
                    onChange={(e) => setUserStats({...userStats, height: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="65"
                    value={userStats.weight}
                    onChange={(e) => setUserStats({...userStats, weight: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">Health Goal</Label>
                <select
                  id="goal"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={userStats.goal}
                  onChange={(e) => setUserStats({...userStats, goal: e.target.value})}
                >
                  <option value="fat_loss">Fat Loss</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="muscle_gain">Muscle Gain</option>
                </select>
              </div>
              
              <Button onClick={calculateBMI} variant="hero" className="w-full">
                Calculate & Generate Plan
              </Button>
            </div>
          </Card>

          {bmiCalculated && (
            <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <h3 className="font-semibold mb-3">Your Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">BMI</span>
                  <span className={cn("font-bold", getBMICategory(bmi).color)}>
                    {bmi} ({getBMICategory(bmi).category})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Daily Calories</span>
                  <span className="font-bold text-foreground">{dailyCalories}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Goal</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    {getGoalIcon(userStats.goal)}
                    {userStats.goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Weekly Meal Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">This Week's Meal Plan</h2>
            <Button variant="fresh" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Generate Grocery List
            </Button>
          </div>

          <div className="space-y-4">
            {mealPlans.map((plan) => (
              <Card key={plan.day} className="p-6">
                <div className="space-y-4">
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {plan.day}
                      </h3>
                      <p className="text-sm text-muted-foreground">{plan.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        {getTotalCalories(plan.meals)} calories
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPantryPercentage(plan.meals)}% from pantry
                      </div>
                    </div>
                  </div>

                  {/* Meals Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(plan.meals).map(([mealType, meal]) => {
                      if (!meal) return null;
                      return (
                        <div key={mealType} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase">
                              {mealType}
                            </span>
                            {meal.fromPantry && (
                              <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                                Pantry
                              </span>
                            )}
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-foreground mb-1">{meal.name}</p>
                            <p className="text-xs text-muted-foreground">{meal.calories} cal</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Meal Plan Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <ChefHat className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">85%</div>
              <div className="text-sm text-muted-foreground">Meals from pantry</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">1,847</div>
              <div className="text-sm text-muted-foreground">Avg daily calories</div>
            </Card>
            
            <Card className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-harvest mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">$12</div>
              <div className="text-sm text-muted-foreground">Estimated savings</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;