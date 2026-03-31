-- ============================================
-- Vibe Card Database Schema
-- Run this in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================

-- 1. Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Vibe Cards table
create table if not exists public.vibe_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  photo_url text,
  mood text not null check (mood in ('happy', 'chill', 'fired-up', 'dreamy', 'zen', 'bold')),
  message text check (char_length(message) <= 280),
  background_color text default '#FDE68A',
  is_public boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Indexes for performance
create index if not exists idx_vibe_cards_user_id on public.vibe_cards(user_id);
create index if not exists idx_vibe_cards_created_at on public.vibe_cards(created_at desc);
create index if not exists idx_vibe_cards_mood on public.vibe_cards(mood);
create index if not exists idx_vibe_cards_public on public.vibe_cards(is_public) where is_public = true;

-- 4. Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.vibe_cards enable row level security;

-- 5. RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 6. RLS Policies for vibe_cards
create policy "Public vibe cards are viewable by everyone"
  on public.vibe_cards for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can create their own vibe cards"
  on public.vibe_cards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vibe cards"
  on public.vibe_cards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own vibe cards"
  on public.vibe_cards for delete
  using (auth.uid() = user_id);

-- 7. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger vibe_cards_updated_at
  before update on public.vibe_cards
  for each row execute procedure public.update_updated_at();

-- 9. Storage bucket for vibe card photos
insert into storage.buckets (id, name, public)
values ('vibe-photos', 'vibe-photos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Anyone can view vibe photos"
  on storage.objects for select
  using (bucket_id = 'vibe-photos');

create policy "Authenticated users can upload vibe photos"
  on storage.objects for insert
  with check (bucket_id = 'vibe-photos' and auth.role() = 'authenticated');

create policy "Users can delete their own vibe photos"
  on storage.objects for delete
  using (bucket_id = 'vibe-photos' and auth.uid()::text = (storage.foldername(name))[1]);
