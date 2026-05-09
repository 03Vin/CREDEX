-- SQL Schema for AI Spend Audit

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  team_size INTEGER NOT NULL CHECK (team_size > 0),
  use_case TEXT NOT NULL,
  tools JSONB NOT NULL,
  results JSONB NOT NULL,
  email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') -- Basic email validation
);

-- Enable Row Level Security (RLS) if needed, or keep it simple for MVP
-- For MVP, we might allow anonymous inserts if the anon key is used.
-- ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert audits (for lead capture)
-- CREATE POLICY "Allow anonymous inserts" ON audits FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to read an audit by ID (for sharing)
-- CREATE POLICY "Allow reading by ID" ON audits FOR SELECT USING (true);
