import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Leaf, 
  Package, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Recycle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-sustainability.jpg';

const LandingPage = () => {
  const features = [
    {
      icon: Package,
      title: "Smart Pantry Tracking",
      description: "Track your food inventory with expiry dates and smart alerts to prevent waste"
    },
    {
      icon: Sparkles,
      title: "AI Recipe Generator", 
      description: "Transform leftovers into delicious meals with AI-powered recipe suggestions"
    },
    {
      icon: Calendar,
      title: "Personalized Meal Planning",
      description: "BMI-based meal plans that prioritize your pantry items for healthier, sustainable eating"
    },
    {
      icon: BarChart3,
      title: "Impact Dashboard",
      description: "Visualize your environmental impact and earn sustainability badges"
    }
  ];

  const benefits = [
    "Reduce food waste by up to 40%",
    "Save money on grocery bills", 
    "Lower your carbon footprint",
    "Discover new recipes with leftovers",
    "Plan healthier, sustainable meals",
    "Join a community of eco-conscious eaters"
  ];

  const stats = [
    { number: "1.3B", label: "Tons of food wasted annually" },
    { number: "40%", label: "Food waste reduction potential" },
    { number: "8%", label: "Global greenhouse gas emissions" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-earth overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Turn Food Waste into 
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Sustainable Action</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Smart pantry management, AI-powered recipe suggestions, and personalized meal planning 
                  to help you reduce waste and eat sustainably.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg" className="text-lg px-8">
                  <Link to="/dashboard">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="earth" size="lg" className="text-lg px-8">
                  <Link to="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src={heroImage} 
                alt="Fresh organic produce and pantry items" 
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-card">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">The Food Waste Crisis</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Food waste is one of the world's biggest problems. Together, we can make a difference.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need for Sustainable Living
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to help you manage your pantry, reduce waste, and live more sustainably
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-medium transition-spring bg-card/50">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-foreground">
                  Why Choose FreshTrack?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of users who have already transformed their relationship with food
                </p>
              </div>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <Globe className="h-8 w-8 text-success mb-3" />
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div className="text-sm text-muted-foreground">Pounds of food saved</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 mt-8">
                <Users className="h-8 w-8 text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Active users</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-harvest/10 to-harvest/5 border-harvest/20 -mt-8">
                <Recycle className="h-8 w-8 text-harvest mb-3" />
                <div className="text-2xl font-bold text-foreground">85%</div>
                <div className="text-sm text-muted-foreground">Waste reduction</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-accent-vibrant/10 to-accent-vibrant/5 border-accent-vibrant/20">
                <Leaf className="h-8 w-8 text-accent-vibrant mb-3" />
                <div className="text-2xl font-bold text-foreground">2.5M</div>
                <div className="text-sm text-muted-foreground">CO₂ lbs prevented</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-primary-foreground">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-foreground/80">
            Join the sustainability movement and start reducing your food waste today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg" className="text-lg px-8">
              <Link to="/dashboard">
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;