-- Add missing fields for Discovery Wizard to scan_jobs table
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS business_criticality TEXT CHECK (business_criticality IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE public.scan_jobs ADD COLUMN IF NOT EXISTS scan_configuration JSONB DEFAULT '{}'::jsonb;
