-- This SQL schema is a conceptual representation of the data structures
-- managed by the Cloudflare Durable Objects in the NexusFlow application.
-- The actual implementation is NoSQL-based, but this provides a relational model.
-- Table to store user account information and subscription status.
-- In the app, this is managed by the `AppController` Durable Object.
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Stripe-related fields for subscription management
  stripe_customer_id TEXT UNIQUE,
  subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('pro', 'premium')),
  subscription_status VARCHAR(20) CHECK (subscription_status IN ('active', 'trialing', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired'))
);
-- Enable Row-Level Security (RLS) for the users table.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Policy: Users can view and update their own information.
CREATE POLICY "Users can manage their own data"
ON users
FOR ALL
USING (auth.uid() = id);
-- Table to store Key Performance Indicators (KPIs) for each user.
-- In the app, this data is part of the state of a user-specific `ProductionDataAgent` DO.
CREATE TABLE kpis (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  change TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Enable RLS for KPIs.
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only access their own KPIs.
CREATE POLICY "Users can access their own KPIs"
ON kpis
FOR ALL
USING (auth.uid() = user_id);
-- Table for predictive maintenance alerts.
-- In the app, this is part of the `ProductionDataAgent` state.
CREATE TABLE maintenance_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machine_id TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Acknowledged', 'Resolved')),
  "timestamp" TIMESTAMPTZ NOT NULL
);
-- Enable RLS for maintenance alerts.
ALTER TABLE maintenance_alerts ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only access their own alerts.
CREATE POLICY "Users can access their own maintenance alerts"
ON maintenance_alerts
FOR ALL
USING (auth.uid() = user_id);
-- Table for production tasks in the schedule.
-- In the app, this is part of the `ProductionDataAgent` state.
CREATE TABLE production_tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  machine_id TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Upcoming', 'In Progress', 'Completed'))
);
-- Enable RLS for production tasks.
ALTER TABLE production_tasks ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only access their own tasks.
CREATE POLICY "Users can access their own production tasks"
ON production_tasks
FOR ALL
USING (auth.uid() = user_id);
-- Table for quality control defects.
-- In the app, this is part of the `ProductionDataAgent` state.
CREATE TABLE quality_defects (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  defect_type VARCHAR(20) NOT NULL CHECK (defect_type IN ('Cosmetic', 'Functional', 'Structural')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'Major', 'Minor')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Investigating', 'Resolved')),
  "timestamp" TIMESTAMPTZ NOT NULL
);
-- Enable RLS for quality defects.
ALTER TABLE quality_defects ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only access their own defects.
CREATE POLICY "Users can access their own quality defects"
ON quality_defects
FOR ALL
USING (auth.uid() = user_id);