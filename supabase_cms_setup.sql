-- Create the 'pages' table
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL
);

-- Create the 'page_blocks' table
CREATE TABLE IF NOT EXISTS public.page_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies for 'pages'
CREATE POLICY "Enable read access for all users" ON public.pages
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.pages
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for 'page_blocks'
CREATE POLICY "Enable read access for all users" ON public.page_blocks
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.page_blocks
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial pages
INSERT INTO public.pages (slug, title) VALUES 
('home', 'Home'),
('chi-siamo', 'Chi Siamo'),
('don-mario', 'Don Mario'),
('bambui', 'Bambuí')
ON CONFLICT (slug) DO NOTHING;
