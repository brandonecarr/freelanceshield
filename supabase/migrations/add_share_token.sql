-- Add share_token to reviews for shareable public links
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS share_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL;

-- Backfill any existing rows that somehow got NULL (shouldn't happen with DEFAULT + NOT NULL, but just in case)
UPDATE public.reviews SET share_token = gen_random_uuid() WHERE share_token IS NULL;
