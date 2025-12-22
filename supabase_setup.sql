-- Create the 'photos' table
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    url TEXT NOT NULL,
    caption TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Create the 'documents' table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for 'photos'
-- Allow public read access
CREATE POLICY "Enable read access for all users" ON public.photos
    FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert, update, delete
CREATE POLICY "Enable all access for authenticated users" ON public.photos
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for 'documents'
-- Allow public read access
CREATE POLICY "Enable read access for all users" ON public.documents
    FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert, update, delete
CREATE POLICY "Enable all access for authenticated users" ON public.documents
    FOR ALL USING (auth.role() = 'authenticated');
