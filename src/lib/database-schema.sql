-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    height INTEGER, -- in cm
    weight DECIMAL(5,2), -- in kg
    bmi DECIMAL(4,1),
    health_goal TEXT CHECK (health_goal IN ('fat_loss', 'maintenance', 'muscle_gain')),
    credits INTEGER DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create pantry items table
CREATE TABLE pantry_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'pieces',
    expiry_date DATE NOT NULL,
    category TEXT NOT NULL,
    status TEXT CHECK (status IN ('fresh', 'expiring', 'expired', 'used', 'donated', 'sold')) DEFAULT 'fresh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE donations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES pantry_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    contact_info TEXT,
    notes TEXT,
    status TEXT CHECK (status IN ('pending', 'completed')) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES pantry_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    platform TEXT NOT NULL,
    description TEXT,
    contact_method TEXT,
    status TEXT CHECK (status IN ('listed', 'sold', 'cancelled')) DEFAULT 'listed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sustainability stats table
CREATE TABLE sustainability_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_items INTEGER DEFAULT 0,
    items_used INTEGER DEFAULT 0,
    items_donated INTEGER DEFAULT 0,
    items_sold INTEGER DEFAULT 0,
    co2_saved DECIMAL(8,2) DEFAULT 0, -- in kg
    food_saved_kg DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create meal plans table
CREATE TABLE meal_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    plan_data JSONB NOT NULL, -- Store the entire meal plan as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_pantry_items_user_id ON pantry_items(user_id);
CREATE INDEX idx_pantry_items_status ON pantry_items(status);
CREATE INDEX idx_pantry_items_expiry ON pantry_items(expiry_date);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Pantry items policies
CREATE POLICY "Users can view their own pantry items" ON pantry_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pantry items" ON pantry_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pantry items" ON pantry_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pantry items" ON pantry_items
    FOR DELETE USING (auth.uid() = user_id);

-- Donations policies
CREATE POLICY "Users can view their own donations" ON donations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own donations" ON donations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sales policies
CREATE POLICY "Users can view their own sales" ON sales
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales" ON sales
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales" ON sales
    FOR UPDATE USING (auth.uid() = user_id);

-- Sustainability stats policies
CREATE POLICY "Users can view their own stats" ON sustainability_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON sustainability_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON sustainability_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Meal plans policies
CREATE POLICY "Users can view their own meal plans" ON meal_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans" ON meal_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" ON meal_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans" ON meal_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create user profile and stats
CREATE OR REPLACE FUNCTION create_user_profile_and_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO user_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create sustainability stats
  INSERT INTO sustainability_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER create_profile_and_stats_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_and_stats();

-- Create function to update sustainability stats when pantry items change
CREATE OR REPLACE FUNCTION update_sustainability_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update stats based on item status changes
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'used' THEN
      UPDATE sustainability_stats 
      SET 
        items_used = items_used + 1,
        co2_saved = co2_saved + 0.5, -- Estimate: 0.5kg CO2 per item saved
        food_saved_kg = food_saved_kg + CASE 
          WHEN NEW.unit = 'kg' THEN NEW.quantity 
          WHEN NEW.unit = 'g' THEN NEW.quantity / 1000.0
          ELSE 0.2 * NEW.quantity -- Default estimate for other units
        END,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSIF NEW.status = 'donated' THEN
      UPDATE sustainability_stats 
      SET 
        items_donated = items_donated + 1,
        co2_saved = co2_saved + 0.3,
        food_saved_kg = food_saved_kg + CASE 
          WHEN NEW.unit = 'kg' THEN NEW.quantity 
          WHEN NEW.unit = 'g' THEN NEW.quantity / 1000.0
          ELSE 0.2 * NEW.quantity
        END,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSIF NEW.status = 'sold' THEN
      UPDATE sustainability_stats 
      SET 
        items_sold = items_sold + 1,
        co2_saved = co2_saved + 0.3,
        food_saved_kg = food_saved_kg + CASE 
          WHEN NEW.unit = 'kg' THEN NEW.quantity 
          WHEN NEW.unit = 'g' THEN NEW.quantity / 1000.0
          ELSE 0.2 * NEW.quantity
        END,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for pantry item updates
CREATE TRIGGER update_stats_on_pantry_change
  AFTER UPDATE ON pantry_items
  FOR EACH ROW
  EXECUTE FUNCTION update_sustainability_stats();

-- Create function to add credits when items are donated/sold
CREATE OR REPLACE FUNCTION add_credits_for_action()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'donations' THEN
    -- Add 10 credits for donations
    UPDATE user_profiles 
    SET 
      credits = credits + 10,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'sales' THEN
    -- Add 15 credits for sales
    UPDATE user_profiles 
    SET 
      credits = credits + 15,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for adding credits
CREATE TRIGGER add_credits_for_donations
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION add_credits_for_action();

CREATE TRIGGER add_credits_for_sales
  AFTER INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION add_credits_for_action();