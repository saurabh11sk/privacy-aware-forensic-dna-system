-- 02_evidence_and_logs.sql
-- Evidence tables + audit logs

-- 1. Evidence samples metadata
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id text NULL,
  population_id int REFERENCES populations(id),
  submitted_by uuid REFERENCES users(id),
  received_at timestamptz DEFAULT now(),
  notes text
);

-- 2. Evidence genotypes per locus
CREATE TABLE IF NOT EXISTS evidence_genotypes (
  id bigserial PRIMARY KEY,
  evidence_id uuid REFERENCES evidence(id) ON DELETE CASCADE,
  locus_id int REFERENCES str_loci(id),
  allele1 text,
  allele2 text,
  UNIQUE (evidence_id, locus_id)
);

-- 3. Match results for evidence
CREATE TABLE IF NOT EXISTS evidence_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id uuid REFERENCES evidence(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id),
  score numeric,  -- similarity score (1.0 = exact)
  matched_at timestamptz DEFAULT now()
);

-- 4. Audit / system logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  event_ts timestamptz DEFAULT now(),
  actor uuid NULL REFERENCES users(id),
  event_type text NOT NULL,
  details jsonb
);

