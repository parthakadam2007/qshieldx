-- Storage buckets creation for Supabase

-- Insert into the storage.buckets table
INSERT INTO storage.buckets (id, name, public) VALUES 
('reports', 'reports', false),
('cbom', 'cbom', false),
('attack-graphs', 'attack-graphs', false),
('raw-scans', 'raw-scans', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'reports' AND auth.uid() = owner);

CREATE POLICY "Users can insert their own reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reports' AND auth.uid() = owner);

-- RLS Policies for cbom
CREATE POLICY "Users can view their own cbom"
ON storage.objects FOR SELECT
USING (bucket_id = 'cbom' AND auth.uid() = owner);

CREATE POLICY "Users can insert their own cbom"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cbom' AND auth.uid() = owner);

-- RLS Policies for attack-graphs
CREATE POLICY "Users can view their own attack-graphs"
ON storage.objects FOR SELECT
USING (bucket_id = 'attack-graphs' AND auth.uid() = owner);

CREATE POLICY "Users can insert their own attack-graphs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attack-graphs' AND auth.uid() = owner);

-- RLS Policies for raw-scans
CREATE POLICY "Users can view their own raw-scans"
ON storage.objects FOR SELECT
USING (bucket_id = 'raw-scans' AND auth.uid() = owner);

CREATE POLICY "Users can insert their own raw-scans"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'raw-scans' AND auth.uid() = owner);
