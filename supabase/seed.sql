-- FreelanceShield Seed Users
-- Run this in the Supabase SQL Editor AFTER running schema.sql
-- Requires the pgcrypto extension (enabled by default on Supabase)
--
-- Test accounts created:
--   admin@freelanceshield.com   / Admin1234!   (solo plan)
--   dev@test.com                / Test1234!    (solo plan - developer/california)
--   designer@test.com           / Test1234!    (free plan - designer/new_york)
--   marketer@test.com           / Test1234!    (free plan - marketer/texas)

-- ----------------------------------------------------------------
-- 1. Insert auth users with bcrypt-hashed passwords
-- ----------------------------------------------------------------
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'admin@freelanceshield.com',
    crypt('Admin1234!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'dev@test.com',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'designer@test.com',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'marketer@test.com',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 2. Insert identities (required for Supabase email/password login)
-- ----------------------------------------------------------------
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@freelanceshield.com',
    '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@freelanceshield.com"}',
    'email',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'dev@test.com',
    '{"sub":"00000000-0000-0000-0000-000000000002","email":"dev@test.com"}',
    'email',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'designer@test.com',
    '{"sub":"00000000-0000-0000-0000-000000000003","email":"designer@test.com"}',
    'email',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    'marketer@test.com',
    '{"sub":"00000000-0000-0000-0000-000000000004","email":"marketer@test.com"}',
    'email',
    now(), now(), now()
  )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 3. Upsert profiles (the trigger normally handles this, but we
--    set plan, freelancer_type, and us_state explicitly here)
-- ----------------------------------------------------------------
INSERT INTO public.profiles (
  id,
  email,
  freelancer_type,
  us_state,
  plan,
  reviews_used_this_month,
  reviews_reset_date,
  created_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@freelanceshield.com',
    'developer',
    'california',
    'solo',
    0,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'dev@test.com',
    'developer',
    'california',
    'solo',
    0,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'designer@test.com',
    'designer',
    'new_york',
    'free',
    0,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'marketer@test.com',
    'marketer',
    'texas',
    'free',
    0,
    now(),
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  email           = EXCLUDED.email,
  freelancer_type = EXCLUDED.freelancer_type,
  us_state        = EXCLUDED.us_state,
  plan            = EXCLUDED.plan;
