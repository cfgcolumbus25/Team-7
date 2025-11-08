-- Drop restrictive policies
DROP POLICY IF EXISTS "Service role can manage users" ON users;
DROP POLICY IF EXISTS "Service role can manage PDFs" ON pdfs;
DROP POLICY IF EXISTS "Service role can manage research data" ON research_data;
DROP POLICY IF EXISTS "Service role can manage email templates" ON email_templates;

-- Create permissive policies
CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on PDFs"
  ON pdfs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on research data"
  ON research_data FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on email templates"
  ON email_templates FOR ALL
  USING (true)
  WITH CHECK (true);

-- Storage policies
DROP POLICY IF EXISTS "Service role can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view PDFs" ON storage.objects;

CREATE POLICY "Allow all storage operations"
  ON storage.objects FOR ALL
  USING (bucket_id = 'pdfs')
  WITH CHECK (bucket_id = 'pdfs');
