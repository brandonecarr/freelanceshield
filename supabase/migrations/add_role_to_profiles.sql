-- Migration: Add role column to profiles
-- Run this in the Supabase SQL Editor AFTER schema.sql has been applied

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- Grant admin role to the seed admin user
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@freelanceshield.com';
