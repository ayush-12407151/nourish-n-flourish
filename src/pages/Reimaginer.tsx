import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Sparkles, 
  ChefHat, 
  Clock, 
  Users, 
  Utensils,
  Gift,
  DollarSign,
  Bot,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  recipes?: Recipe[];
  timestamp: Date;
}

interface Recipe {
  id: string;
  name: string;
  prepTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
}

const Reimaginer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI Leftover Reimaginer! Tell me what ingredients you have, and I'll suggest creative recipes to transform them into delicious meals. What's in your pantry today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock recipe database - replace with real AI integration
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Mediterranean Rice Bowl',
      prepTime: '15 mins',
      servings: 2,
      difficulty: 'Easy',
      ingredients: ['leftover rice', 'tomatoes', 'olive oil', 'feta cheese', 'herbs'],
      instructions: [
        'Heat leftover rice in a pan with olive oil',
        'Add diced tomatoes and cook for 3-4 minutes',
        'Season with herbs and serve with crumbled feta'
      ]
    },
    {
      id: '2', 
      name: 'Veggie Fried Rice',
      prepTime: '20 mins',
      servings: 3,
      difficulty: 'Medium',
      ingredients: ['leftover rice', 'mixed vegetables', 'soy sauce', 'eggs', 'garlic'],
      instructions: [
        'Scramble eggs in a large pan and set aside',
        'Stir-fry vegetables with garlic',
        'Add rice and soy sauce, then fold in scrambled eggs'
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Great! I found some delicious recipes using your ingredients. Here are my suggestions:",
        recipes: mockRecipes,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRecipeAction = (recipeId: string, action: 'use' | 'donate' | 'sell') => {
    console.log(`Recipe ${recipeId} action: ${action}`);
    // Handle recipe action logic here
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'Hard': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Leftover Reimaginer</h1>
        </div>
        <p className="text-muted-foreground">Transform your leftovers into amazing meals with AI-powered recipe suggestions</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-3",
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}>
              {message.type === 'bot' && (
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <div className={cn(
                "max-w-lg space-y-2",
                message.type === 'user' ? 'items-end' : 'items-start'
              )}>
                <div className={cn(
                  "px-4 py-2 rounded-lg",
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                )}>
                  <p className="text-sm">{message.content}</p>
                </div>
                
                {/* Recipe Cards */}
                {message.recipes && (
                  <div className="space-y-3 mt-4">
                    {message.recipes.map((recipe) => (
                      <Card key={recipe.id} className="p-4 bg-background border-border">
                        <div className="space-y-3">
                          {/* Recipe Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <ChefHat className="h-4 w-4" />
                                {recipe.name}
                              </h3>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {recipe.prepTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {recipe.servings} servings
                                </span>
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  getDifficultyColor(recipe.difficulty)
                                )}>
                                  {recipe.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ingredients */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Ingredients:</p>
                            <div className="flex flex-wrap gap-1">
                              {recipe.ingredients.map((ingredient, idx) => (
                                <span key={idx} className="text-xs bg-accent px-2 py-1 rounded-md text-accent-foreground">
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="success"
                              className="flex-1 text-xs"
                              onClick={() => handleRecipeAction(recipe.id, 'use')}
                            >
                              <Utensils className="h-3 w-3 mr-1" />
                              Cook This
                            </Button>
                            <Button 
                              size="sm" 
                              variant="fresh"
                              className="flex-1 text-xs"
                              onClick={() => handleRecipeAction(recipe.id, 'donate')}
                            >
                              <Gift className="h-3 w-3 mr-1" />
                              Share Recipe
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tell me what ingredients you have... (e.g., leftover rice, tomatoes, cheese)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              variant="hero"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Try:</span>
            {['Rice + vegetables', 'Bread + eggs', 'Pasta + cheese'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs bg-muted hover:bg-accent px-2 py-1 rounded-md text-muted-foreground hover:text-accent-foreground transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reimaginer;