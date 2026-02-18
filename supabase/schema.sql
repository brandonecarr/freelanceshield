-- FreelanceShield Database Schema
-- Run this in your Supabase SQL editor

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  freelancer_type text check (freelancer_type in ('developer', 'designer', 'marketer', 'creative', 'video', 'other')),
  us_state text,
  plan text default 'free' check (plan in ('free', 'solo', 'pro', 'agency')),
  role text default 'user' check (role in ('user', 'admin')),
  stripe_customer_id text,
  stripe_subscription_id text,
  reviews_used_this_month integer default 0,
  reviews_reset_date timestamptz default now(),
  created_at timestamptz default now()
);

-- Contract reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  file_name text,
  raw_text text,
  freelancer_type text,
  us_state text,
  overall_risk_score integer check (overall_risk_score between 1 and 10),
  risk_summary text,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'error')),
  error_message text,
  created_at timestamptz default now()
);

-- Individual clause analyses (one row per clause per review)
create table public.clauses (
  id uuid default gen_random_uuid() primary key,
  review_id uuid references public.reviews on delete cascade,
  clause_type text not null,
  original_text text,
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  plain_english text,
  specific_concern text,
  suggested_edit text,
  sort_order integer,
  created_at timestamptz default now()
);

-- Contract templates
create table public.templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  freelancer_type text,
  us_state text,
  content text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Attorney escalations (Phase 3+)
create table public.escalations (
  id uuid default gen_random_uuid() primary key,
  review_id uuid references public.reviews,
  user_id uuid references public.profiles,
  attorney_id uuid,
  status text default 'pending' check (status in ('pending', 'assigned', 'in_review', 'complete')),
  amount_paid integer,
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.clauses enable row level security;
alter table public.templates enable row level security;
alter table public.escalations enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Reviews policies
create policy "Users can view own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Users can create own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- Clauses policies
create policy "Users can view clauses of own reviews"
  on public.clauses for select
  using (
    exists (
      select 1 from public.reviews
      where reviews.id = clauses.review_id
      and reviews.user_id = auth.uid()
    )
  );

-- Templates are public read
create policy "Anyone can view active templates"
  on public.templates for select
  using (is_active = true);

-- Escalations policies
create policy "Users can view own escalations"
  on public.escalations for select
  using (auth.uid() = user_id);

create policy "Users can create own escalations"
  on public.escalations for insert
  with check (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_created_at_idx on public.reviews(created_at desc);
create index clauses_review_id_idx on public.clauses(review_id);
create index clauses_risk_level_idx on public.clauses(risk_level);
