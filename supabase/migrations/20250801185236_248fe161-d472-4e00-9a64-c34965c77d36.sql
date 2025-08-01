-- Add storage for user uploaded images
INSERT INTO storage.buckets (id, name, public) VALUES ('vitrine-images', 'vitrine-images', true);

-- Create policies for vitrine images bucket
CREATE POLICY "Users can view vitrine images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vitrine-images');

CREATE POLICY "Users can upload vitrine images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vitrine-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own vitrine images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vitrine-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own vitrine images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vitrine-images' AND auth.uid() IS NOT NULL);

-- Add analytics table for tracking vitrine stats
CREATE TABLE public.vitrine_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vitrine_id UUID NOT NULL,
  visits_count INTEGER NOT NULL DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE public.vitrine_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Users can view their vitrine analytics" 
ON public.vitrine_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM vitrines 
  WHERE vitrines.id = vitrine_analytics.vitrine_id 
  AND vitrines.user_id = auth.uid()
));

CREATE POLICY "System can update analytics" 
ON public.vitrine_analytics 
FOR ALL 
USING (true);