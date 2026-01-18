CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles and Users
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Populations and Loci
CREATE TABLE populations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE str_loci (
  id SERIAL PRIMARY KEY,
  locus TEXT UNIQUE NOT NULL
);

-- Allele frequencies (optional)
CREATE TABLE allele_frequencies (
  id SERIAL PRIMARY KEY,
  population_id INT REFERENCES populations(id),
  locus_id INT REFERENCES str_loci(id),
  allele VARCHAR(10) NOT NULL,
  frequency NUMERIC(6,5) NOT NULL,
  UNIQUE (population_id, locus_id, allele)
);

-- Profiles and Genotypes
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sample_id TEXT UNIQUE NOT NULL,
  population_id INT REFERENCES populations(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

CREATE TABLE profile_genotypes (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  locus_id INT REFERENCES str_loci(id),
  allele1 VARCHAR(10) NOT NULL,
  allele2 VARCHAR(10) NOT NULL,
  UNIQUE (profile_id, locus_id)
);

-- Privacy Encoding
CREATE TABLE profile_privacy_encodings (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  payload BYTEA NOT NULL
);

-- Evidence and Genotypes
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evidence_code TEXT UNIQUE NOT NULL,
  submitted_by UUID REFERENCES users(id),
  received_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);

CREATE TABLE evidence_genotypes (
  id SERIAL PRIMARY KEY,
  evidence_id UUID REFERENCES evidence(id) ON DELETE CASCADE,
  locus_id INT REFERENCES str_loci(id),
  allele1 VARCHAR(10) NOT NULL,
  allele2 VARCHAR(10) NOT NULL,
  UNIQUE (evidence_id, locus_id)
);

-- Audit Logs (Tamper Evident)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  at TIMESTAMPTZ DEFAULT now(),
  actor_user UUID REFERENCES users(id),
  action TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id TEXT NOT NULL,
  details JSONB,
  prev_hash BYTEA,
  curr_hash BYTEA
);

CREATE INDEX idx_profiles_population ON profiles(population_id);
CREATE INDEX idx_pg_profile_locus ON profile_genotypes(profile_id, locus_id);
CREATE INDEX idx_eg_evidence_locus ON evidence_genotypes(evidence_id, locus_id);
CREATE INDEX idx_audit_at ON audit_logs(at);

