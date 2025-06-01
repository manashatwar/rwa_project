-- Create users table for additional profile information
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text,
    wallet_address text UNIQUE,
    wallet_signature text,
    auth_method text DEFAULT 'email',
    avatar_url text,
    phone text,
    company text,
    job_title text,
    bio text,
    website text,
    location text,
    timezone text,
    language text DEFAULT 'en',
    notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}',
    kyc_status text DEFAULT 'pending',
    kyc_documents jsonb DEFAULT '[]',
    risk_profile text DEFAULT 'moderate',
    investment_experience text DEFAULT 'beginner',
    annual_income_range text,
    net_worth_range text,
    investment_goals jsonb DEFAULT '[]',
    last_login timestamp with time zone,
    login_count integer DEFAULT 0,
    terms_accepted_at timestamp with time zone,
    privacy_accepted_at timestamp with time zone,
    marketing_consent boolean DEFAULT false,
    two_factor_enabled boolean DEFAULT false,
    account_status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_auth_method ON public.users(auth_method);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.users;
CREATE POLICY "Users can manage their own profile"
ON public.users FOR ALL
USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    asset_type text NOT NULL,
    description text,
    current_value numeric(15,2) NOT NULL DEFAULT 0,
    original_value numeric(15,2) NOT NULL DEFAULT 0,
    verification_status text NOT NULL DEFAULT 'pending',
    collateralization_status text NOT NULL DEFAULT 'available',
    collateral_ratio numeric(5,2) DEFAULT 0,
    location text,
    documents jsonb DEFAULT '[]',
    blockchain text DEFAULT 'ethereum',
    token_address text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.loans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id uuid REFERENCES public.assets(id) ON DELETE CASCADE,
    loan_amount numeric(15,2) NOT NULL,
    outstanding_balance numeric(15,2) NOT NULL,
    interest_rate numeric(5,2) NOT NULL,
    loan_term_months integer NOT NULL,
    monthly_payment numeric(15,2) NOT NULL,
    next_payment_date date NOT NULL,
    loan_status text NOT NULL DEFAULT 'active',
    blockchain text DEFAULT 'ethereum',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    loan_id uuid REFERENCES public.loans(id) ON DELETE CASCADE,
    amount numeric(15,2) NOT NULL,
    currency text NOT NULL DEFAULT 'USD',
    crypto_currency text,
    exchange_rate numeric(15,8),
    transaction_hash text,
    blockchain text DEFAULT 'ethereum',
    payment_status text NOT NULL DEFAULT 'pending',
    payment_date timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cross_chain_positions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    blockchain text NOT NULL,
    asset_address text NOT NULL,
    asset_symbol text NOT NULL,
    balance numeric(20,8) NOT NULL DEFAULT 0,
    usd_value numeric(15,2) NOT NULL DEFAULT 0,
    position_type text NOT NULL DEFAULT 'asset',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assets_user_id ON public.assets(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON public.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_cross_chain_positions_user_id ON public.cross_chain_positions(user_id);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_chain_positions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own assets" ON public.assets;
CREATE POLICY "Users can manage their own assets"
ON public.assets FOR ALL
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own loans" ON public.loans;
CREATE POLICY "Users can manage their own loans"
ON public.loans FOR ALL
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own payments" ON public.payments;
CREATE POLICY "Users can manage their own payments"
ON public.payments FOR ALL
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own positions" ON public.cross_chain_positions;
CREATE POLICY "Users can manage their own positions"
ON public.cross_chain_positions FOR ALL
USING (auth.uid() = user_id);

INSERT INTO public.assets (user_id, name, asset_type, description, current_value, original_value, verification_status, collateralization_status, location, blockchain)
SELECT 
    id,
    'Downtown Office Building',
    'Commercial Real Estate',
    'Prime commercial property in downtown business district',
    850000.00,
    800000.00,
    'verified',
    'collateralized',
    'New York, NY',
    'ethereum'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.assets (user_id, name, asset_type, description, current_value, original_value, verification_status, collateralization_status, location, blockchain)
SELECT 
    id,
    'Residential Property #1234',
    'Residential Real Estate',
    'Single family home in suburban area',
    450000.00,
    420000.00,
    'verified',
    'available',
    'Austin, TX',
    'polygon'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.loans (user_id, asset_id, loan_amount, outstanding_balance, interest_rate, loan_term_months, monthly_payment, next_payment_date, loan_status, blockchain)
SELECT 
    u.id,
    a.id,
    400000.00,
    375000.00,
    5.25,
    360,
    2500.00,
    CURRENT_DATE + INTERVAL '1 month',
    'active',
    'ethereum'
FROM auth.users u
CROSS JOIN public.assets a
WHERE a.name = 'Downtown Office Building'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.cross_chain_positions (user_id, blockchain, asset_address, asset_symbol, balance, usd_value, position_type)
SELECT 
    id,
    'ethereum',
    '0xA0b86a33E6441e8e421c7c7c4b8c8c8c8c8c8c8c',
    'USDC',
    15000.00000000,
    15000.00,
    'stablecoin'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.cross_chain_positions (user_id, blockchain, asset_address, asset_symbol, balance, usd_value, position_type)
SELECT 
    id,
    'polygon',
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    'USDC',
    8500.00000000,
    8500.00,
    'stablecoin'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

alter publication supabase_realtime add table assets;
alter publication supabase_realtime add table loans;
alter publication supabase_realtime add table payments;
alter publication supabase_realtime add table cross_chain_positions;