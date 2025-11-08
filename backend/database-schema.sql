-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom users table (separate from Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PDFs table
CREATE TABLE IF NOT EXISTS pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT false
);

-- Research data table
CREATE TABLE IF NOT EXISTS research_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID REFERENCES pdfs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  impact TEXT,
  money TEXT,
  summary TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  research_id UUID REFERENCES research_data(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', false)
ON CONFLICT DO NOTHING;

-- Row Level Security Policies

-- Users table - allow service role full access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage users"
  ON users
  USING (true)
  WITH CHECK (true);

-- PDFs policies
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view PDFs"
  ON pdfs FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage PDFs"
  ON pdfs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Research data policies
ALTER TABLE research_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view research data"
  ON research_data FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage research data"
  ON research_data FOR ALL
  USING (true)
  WITH CHECK (true);

-- Email templates policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage email templates"
  ON email_templates FOR ALL
  USING (true)
  WITH CHECK (true);

-- Storage policies for PDFs bucket
CREATE POLICY "Service role can upload PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Anyone can view PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_research_year ON research_data(year);
CREATE INDEX IF NOT EXISTS idx_pdfs_uploaded_by ON pdfs(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_research_pdf_id ON research_data(pdf_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create an admin user (change password after first login!)
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqGVxW.KqW', -- password: 'admin123'
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;
