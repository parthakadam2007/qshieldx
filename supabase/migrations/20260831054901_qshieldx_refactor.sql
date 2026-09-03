-- scan_jobs
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS scan_mode TEXT CHECK (scan_mode IN ('external', 'internal', 'hybrid')) DEFAULT 'external';
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS repository_url TEXT;
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS shelf_life_years INTEGER;
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS asset_count INTEGER DEFAULT 0;
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS cbom_generated BOOLEAN DEFAULT FALSE;

-- assets
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS artifact_type TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS business_criticality TEXT CHECK (business_criticality IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS lifetime_years INTEGER;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS quantum_status TEXT CHECK (quantum_status IN ('vulnerable', 'transitioning', 'safe', 'unknown')) DEFAULT 'unknown';
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS issuer TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS signature_algorithm TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS key_size INTEGER;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ;

-- findings
ALTER TABLE public.findings ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.findings ADD COLUMN IF NOT EXISTS evidence TEXT;
ALTER TABLE public.findings ADD COLUMN IF NOT EXISTS cve_id TEXT;
ALTER TABLE public.findings ADD COLUMN IF NOT EXISTS cwe_id TEXT;

-- risk_scores
ALTER TABLE public.risk_scores ADD COLUMN IF NOT EXISTS mosca_score NUMERIC;
ALTER TABLE public.risk_scores ADD COLUMN IF NOT EXISTS qars_score NUMERIC;
ALTER TABLE public.risk_scores ADD COLUMN IF NOT EXISTS migration_priority TEXT CHECK (migration_priority IN ('immediate', 'short_term', 'long_term', 'none'));
ALTER TABLE public.risk_scores ADD COLUMN IF NOT EXISTS business_criticality TEXT;
ALTER TABLE public.risk_scores ADD COLUMN IF NOT EXISTS quantum_status TEXT;
ALTER TABLE public.risk_scores ADD COLUMN IF NOT EXISTS explanation TEXT;

-- attack_graph -> attack_graphs
ALTER TABLE IF EXISTS public.attack_graph RENAME TO attack_graphs;
ALTER TABLE IF EXISTS public.attack_graphs ADD COLUMN IF NOT EXISTS graph_metadata JSONB;

-- cbom_reports
ALTER TABLE public.cbom_reports ADD COLUMN IF NOT EXISTS report_json JSONB;
ALTER TABLE public.cbom_reports ADD COLUMN IF NOT EXISTS artifact_count INTEGER DEFAULT 0;
ALTER TABLE public.cbom_reports ADD COLUMN IF NOT EXISTS pqc_ready_percentage NUMERIC DEFAULT 0;
ALTER TABLE public.cbom_reports ADD COLUMN IF NOT EXISTS executive_summary TEXT;

-- agent_activity
ALTER TABLE public.agent_activity ADD COLUMN IF NOT EXISTS agent_name TEXT;
ALTER TABLE public.agent_activity ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.agent_activity ADD COLUMN IF NOT EXISTS runtime_ms INTEGER;
ALTER TABLE public.agent_activity ADD COLUMN IF NOT EXISTS confidence NUMERIC;
ALTER TABLE public.agent_activity ADD COLUMN IF NOT EXISTS payload_reference TEXT;
ALTER TABLE public.agent_activity ADD COLUMN IF NOT EXISTS payload JSONB;

-- Drop obsolete tables
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.ssl_scans;
