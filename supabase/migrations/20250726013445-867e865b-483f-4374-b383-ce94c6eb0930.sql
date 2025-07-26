-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vitrines table
CREATE TABLE public.vitrines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  background_color TEXT DEFAULT '#ffffff',
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#666666',
  text_color TEXT DEFAULT '#333333',
  font_family TEXT DEFAULT 'Inter',
  layout_style TEXT DEFAULT 'minimal',
  is_published BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}',
  custom_css TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vitrine_id UUID NOT NULL REFERENCES public.vitrines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  image_url TEXT,
  external_link TEXT,
  button_text TEXT DEFAULT 'Comprar',
  is_featured BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  category TEXT,
  stock_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitrines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Vitrines policies
CREATE POLICY "Anyone can view published vitrines" 
ON public.vitrines FOR SELECT 
USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own vitrines" 
ON public.vitrines FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vitrines" 
ON public.vitrines FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vitrines" 
ON public.vitrines FOR DELETE 
USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Anyone can view products from published vitrines" 
ON public.products FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.vitrines 
    WHERE vitrines.id = products.vitrine_id 
    AND (vitrines.is_published = true OR vitrines.user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage products in their vitrines" 
ON public.products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.vitrines 
    WHERE vitrines.id = products.vitrine_id 
    AND vitrines.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vitrines_updated_at
  BEFORE UPDATE ON public.vitrines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_vitrines_slug ON public.vitrines(slug);
CREATE INDEX idx_vitrines_user_id ON public.vitrines(user_id);
CREATE INDEX idx_products_vitrine_id ON public.products(vitrine_id);
CREATE INDEX idx_products_position ON public.products(vitrine_id, position);