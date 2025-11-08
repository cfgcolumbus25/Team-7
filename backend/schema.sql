-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth will handle this, but we can extend it)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PDFs table
CREATE TABLE IF NOT EXISTS public.pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT false
);

-- Research data table
CREATE TABLE IF NOT EXISTS public.research_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID REFERENCES public.pdfs(id),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  impact TEXT,
  money TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  research_id UUID REFERENCES public.research_data(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for PDFs bucket
CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can read PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'pdfs');

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
ON public.users FOR SELECT
USING (auth.uid() = id OR role = 'admin');

-- PDFs policies
CREATE POLICY "Anyone can read PDFs"
ON public.pdfs FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert PDFs"
ON public.pdfs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Research data policies (public read)
CREATE POLICY "Anyone can read research data"
ON public.research_data FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert research data"
ON public.research_data FOR INSERT
TO authenticated
WITH CHECK (true);

-- Email templates policies
CREATE POLICY "Authenticated users can read email templates"
ON public.email_templates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert email templates"
ON public.email_templates FOR INSERT
TO authenticated
WITH CHECK (true);
