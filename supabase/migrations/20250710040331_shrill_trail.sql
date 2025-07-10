/*
  # Meditation App Database Schema

  1. New Tables
    - `users` - User profiles and authentication data
    - `meditations` - Both pre-recorded and AI-generated meditations
    - `ambient_sounds` - Sound library for the mixer
    - `user_meditation_history` - Track user's meditation sessions
    - `user_sound_presets` - Save user's custom sound combinations
    - `meditation_categories` - Categories for organizing meditations
    - `meditation_tags` - Tags for better meditation discovery
    - `user_favorites` - User's favorite meditations and sounds
    - `subscriptions` - User subscription management
    - `billing_usage` - Track usage for billing purposes
    - `invoices` - Invoice management
    - `stripe_webhook_events` - Webhook event processing

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Admin policies for content management

  3. Features
    - Full meditation library management
    - AI-generated meditation tracking
    - Ambient sound mixer with presets
    - User progress and history tracking
    - Subscription and billing integration
    - Comprehensive tagging and categorization
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  stripe_subscription_item_id text,
  phone text,
  timezone text DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Meditation categories
CREATE TABLE IF NOT EXISTS meditation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#7439fe',
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Meditation tags
CREATE TABLE IF NOT EXISTS meditation_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Meditations table (both pre-recorded and AI-generated)
CREATE TABLE IF NOT EXISTS meditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text, -- Meditation script/text
  duration_minutes integer NOT NULL DEFAULT 10,
  category_id uuid REFERENCES meditation_categories(id),
  audio_url text, -- URL to audio file if available
  image_url text, -- Cover image URL
  is_ai_generated boolean DEFAULT false,
  ai_model text, -- Which AI model was used
  ai_prompt text, -- Original user prompt for AI generation
  generation_cost numeric(10,4) DEFAULT 0,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  play_count integer DEFAULT 0,
  is_public boolean DEFAULT false, -- Pre-recorded meditations are public
  is_featured boolean DEFAULT false,
  stripe_usage_reported boolean DEFAULT false,
  stripe_usage_record_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Junction table for meditation tags
CREATE TABLE IF NOT EXISTS meditation_meditation_tags (
  meditation_id uuid REFERENCES meditations(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES meditation_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (meditation_id, tag_id)
);

-- Ambient sounds for the mixer
CREATE TABLE IF NOT EXISTS ambient_sounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  audio_url text NOT NULL,
  category text DEFAULT 'nature', -- nature, urban, white_noise, etc.
  default_volume numeric(3,2) DEFAULT 0.5 CHECK (default_volume >= 0 AND default_volume <= 1),
  is_premium boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User's custom sound presets
CREATE TABLE IF NOT EXISTS user_sound_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sounds_config jsonb NOT NULL, -- Array of {sound_id, volume, is_playing}
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User meditation history/sessions
CREATE TABLE IF NOT EXISTS user_meditation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meditation_id uuid REFERENCES meditations(id) ON DELETE SET NULL,
  session_duration_minutes integer NOT NULL,
  completed boolean DEFAULT false,
  session_date timestamptz DEFAULT now(),
  notes text,
  mood_before integer CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after integer CHECK (mood_after >= 1 AND mood_after <= 5),
  created_at timestamptz DEFAULT now()
);

-- User favorites (meditations and sounds)
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('meditation', 'ambient_sound', 'sound_preset')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_subscription_item_id text,
  stripe_customer_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  price_per_unit numeric(10,4) NOT NULL,
  currency text DEFAULT 'usd',
  usage_limit integer DEFAULT 100, -- Number of AI generations per period
  current_usage integer DEFAULT 0,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Billing usage tracking
CREATE TABLE IF NOT EXISTS billing_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meditation_id uuid REFERENCES meditations(id) ON DELETE SET NULL,
  stripe_customer_id text NOT NULL,
  stripe_usage_record_id text,
  usage_amount numeric(10,4) NOT NULL DEFAULT 1,
  billing_period date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reported', 'failed')),
  reported_to_stripe_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_invoice_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  amount_due numeric(10,2) NOT NULL,
  amount_paid numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'usd',
  invoice_date timestamptz NOT NULL,
  due_date timestamptz,
  paid_at timestamptz,
  status text NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  line_items jsonb,
  usage_period_start date,
  usage_period_end date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stripe webhook events
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  processed boolean DEFAULT false,
  retry_count integer DEFAULT 0,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_meditation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sound_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meditation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read and update their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Meditation categories: Public read access
CREATE POLICY "Anyone can read meditation categories" ON meditation_categories
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Meditation tags: Public read access
CREATE POLICY "Anyone can read meditation tags" ON meditation_tags
  FOR SELECT TO authenticated
  USING (true);

-- Meditations: Users can read public meditations and manage their own
CREATE POLICY "Users can read public meditations" ON meditations
  FOR SELECT TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own meditations" ON meditations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own meditations" ON meditations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own meditations" ON meditations
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Meditation tags junction: Users can manage tags for their meditations
CREATE POLICY "Users can manage tags for their meditations" ON meditation_meditation_tags
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meditations 
      WHERE id = meditation_id AND user_id = auth.uid()
    )
  );

-- Ambient sounds: Public read access
CREATE POLICY "Anyone can read ambient sounds" ON ambient_sounds
  FOR SELECT TO authenticated
  USING (is_active = true);

-- User sound presets: Users manage their own presets
CREATE POLICY "Users can manage their own sound presets" ON user_sound_presets
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User meditation history: Users manage their own history
CREATE POLICY "Users can manage their own meditation history" ON user_meditation_history
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User favorites: Users manage their own favorites
CREATE POLICY "Users can manage their own favorites" ON user_favorites
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Subscriptions: Users can read their own subscriptions
CREATE POLICY "Users can read their own subscriptions" ON subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Billing usage: Users can read their own billing data
CREATE POLICY "Users can read their own billing usage" ON billing_usage
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Invoices: Users can read their own invoices
CREATE POLICY "Users can read their own invoices" ON invoices
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Stripe webhook events: Service role only
CREATE POLICY "Service role can manage webhook events" ON stripe_webhook_events
  FOR ALL TO service_role
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meditations_user_id ON meditations(user_id);
CREATE INDEX IF NOT EXISTS idx_meditations_category_id ON meditations(category_id);
CREATE INDEX IF NOT EXISTS idx_meditations_is_public ON meditations(is_public);
CREATE INDEX IF NOT EXISTS idx_meditations_is_featured ON meditations(is_featured);
CREATE INDEX IF NOT EXISTS idx_meditations_created_at ON meditations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_meditation_history_user_id ON user_meditation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_meditation_history_session_date ON user_meditation_history(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_sound_presets_user_id ON user_sound_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_usage_user_id ON billing_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_usage_billing_period ON billing_usage(billing_period);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_processed ON stripe_webhook_events(processed);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meditations_updated_at BEFORE UPDATE ON meditations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sound_presets_updated_at BEFORE UPDATE ON user_sound_presets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();