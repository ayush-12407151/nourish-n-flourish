-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  height INTEGER,
  weight INTEGER,
  bmi DECIMAL(5,2),
  health_goal TEXT CHECK (health_goal IN ('fat_loss', 'maintenance', 'muscle_gain')),
  credits INTEGER NOT NULL DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pantry items table
CREATE TABLE public.pantry_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'pieces',
  expiry_date DATE,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'fresh' CHECK (status IN ('fresh', 'expiring', 'expired', 'used', 'donated', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donation records table
CREATE TABLE public.donation_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.pantry_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  contact_info TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sell records table
CREATE TABLE public.sell_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.pantry_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  platform TEXT NOT NULL,
  description TEXT,
  contact_method TEXT,
  status TEXT NOT NULL DEFAULT 'listed' CHECK (status IN ('listed', 'sold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sustainability stats table
CREATE TABLE public.sustainability_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_items INTEGER NOT NULL DEFAULT 0,
  items_used INTEGER NOT NULL DEFAULT 0,
  items_donated INTEGER NOT NULL DEFAULT 0,
  items_sold INTEGER NOT NULL DEFAULT 0,
  co2_saved DECIMAL(10,2) NOT NULL DEFAULT 0,
  food_saved_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for pantry_items
CREATE POLICY "Users can view their own pantry items" ON public.pantry_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pantry items" ON public.pantry_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pantry items" ON public.pantry_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pantry items" ON public.pantry_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for donation_records
CREATE POLICY "Users can view their own donation records" ON public.donation_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own donation records" ON public.donation_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donation records" ON public.donation_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for sell_records
CREATE POLICY "Users can view their own sell records" ON public.sell_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sell records" ON public.sell_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sell records" ON public.sell_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for sustainability_stats
CREATE POLICY "Users can view their own sustainability stats" ON public.sustainability_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sustainability stats" ON public.sustainability_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sustainability stats" ON public.sustainability_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pantry_items_updated_at
  BEFORE UPDATE ON public.pantry_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sustainability_stats_updated_at
  BEFORE UPDATE ON public.sustainability_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  
  INSERT INTO public.sustainability_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();