-- initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS (Profiles for auth.users)
-- ==========================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'auditor')),
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. SCAN JOBS
-- ==========================================
CREATE TABLE public.scan_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_domain TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  mode TEXT DEFAULT 'fast' CHECK (mode IN ('fast', 'medium', 'deep')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_scan_jobs_user_id ON public.scan_jobs(user_id);
ALTER TABLE public.scan_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own scan jobs" ON public.scan_jobs FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 3. ASSETS
-- ==========================================
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_job_id UUID REFERENCES public.scan_jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('domain', 'subdomain', 'ip', 'service', 'api')),
  asset_value TEXT NOT NULL,
  is_live BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_assets_scan_job_id ON public.assets(scan_job_id);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own assets" ON public.assets FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 4. FINDINGS
-- ==========================================
CREATE TABLE public.findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_job_id UUID REFERENCES public.scan_jobs(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  cvss_score NUMERIC(3,1),
  remediation TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_findings_scan_job_id ON public.findings(scan_job_id);
CREATE INDEX idx_findings_user_id ON public.findings(user_id);
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own findings" ON public.findings FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 5. RISK SCORES
-- ==========================================
CREATE TABLE public.risk_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_domain TEXT NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  factors JSONB DEFAULT '{}'::jsonb,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_risk_scores_user_id ON public.risk_scores(user_id);
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own risk scores" ON public.risk_scores FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 6. ATTACK GRAPH
-- ==========================================
CREATE TABLE public.attack_graph (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_job_id UUID REFERENCES public.scan_jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_attack_graph_scan_job_id ON public.attack_graph(scan_job_id);
CREATE INDEX idx_attack_graph_user_id ON public.attack_graph(user_id);
ALTER TABLE public.attack_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own attack graphs" ON public.attack_graph FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 7. CBOM REPORTS (Cyber Bill of Materials)
-- ==========================================
CREATE TABLE public.cbom_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_job_id UUID REFERENCES public.scan_jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  report_url TEXT,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cbom_reports_scan_job_id ON public.cbom_reports(scan_job_id);
CREATE INDEX idx_cbom_reports_user_id ON public.cbom_reports(user_id);
ALTER TABLE public.cbom_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cbom reports" ON public.cbom_reports FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 8. AGENT ACTIVITY
-- ==========================================
CREATE TABLE public.agent_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_job_id UUID REFERENCES public.scan_jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tool_used TEXT NOT NULL,
  command_executed TEXT,
  output_summary TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'running')),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agent_activity_scan_job_id ON public.agent_activity(scan_job_id);
CREATE INDEX idx_agent_activity_user_id ON public.agent_activity(user_id);
ALTER TABLE public.agent_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own agent activity" ON public.agent_activity FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 9. AUDIT LOGS
-- ==========================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_scan_jobs_modtime BEFORE UPDATE ON public.scan_jobs FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_assets_modtime BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_findings_modtime BEFORE UPDATE ON public.findings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_risk_scores_modtime BEFORE UPDATE ON public.risk_scores FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_attack_graph_modtime BEFORE UPDATE ON public.attack_graph FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_cbom_reports_modtime BEFORE UPDATE ON public.cbom_reports FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TABLE public.settings (
    key TEXT PRIMARY KEY, 
    value JSONB, 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.ssl_scans (
    asset_id UUID PRIMARY KEY, 
    domain TEXT, 
    ssl_data JSONB, 
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);