-- PAUSE: Your Behavioral Intelligence Layer
-- Database Schema

-- Users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz default now(),
  assigned_archetype text,
  archetype_scores jsonb default '{}',
  wellness_baseline integer default 55,
  current_level integer default 1,
  total_points integer default 0,
  current_streak integer default 0,
  last_win_date date,
  messaging_style text check (messaging_style in ('Tough Love', 'Data-Driven', 'Gentle Nudge', 'Balanced')),
  user_why text,
  goals jsonb default '[]',
  safety_gate_response text check (safety_gate_response in ('ok', 'sensitive')),
  questionnaire_completed boolean default false,
  questionnaire_answers jsonb default '{}',
  open_text_responses jsonb default '{}',
  completed_at timestamptz
);

-- Wins table
create table if not exists public.wins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  action_type text not null check (action_type in (
    'closed_app', 'chose_water', 'worked_out', 'cancelled_order',
    'healthy_swap', 'resisted_craving', 'box_breathing',
    'mindful_moment', 'decision_sprint'
  )),
  points_earned integer not null,
  created_at timestamptz default now()
);

create index if not exists idx_wins_user_id on public.wins(user_id);
create index if not exists idx_wins_created_at on public.wins(created_at);

-- App monitor table
create table if not exists public.app_monitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  app_name text not null,
  status text not null check (status in ('TRIGGER', 'WATCH', 'SAFE')),
  is_active boolean default true
);

create index if not exists idx_app_monitors_user_id on public.app_monitors(user_id);

-- Interceptions table
create table if not exists public.interceptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  app_name text not null,
  shown_at timestamptz default now(),
  user_action text not null check (user_action in ('paused', 'continued')),
  points_earned integer default 0
);

create index if not exists idx_interceptions_user_id on public.interceptions(user_id);

-- Daily logs table
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null default current_date,
  total_points integer default 0,
  wins_count integer default 0,
  streak_maintained boolean default false,
  unique(user_id, date)
);

create index if not exists idx_daily_logs_user_id on public.daily_logs(user_id);
create index if not exists idx_daily_logs_date on public.daily_logs(date);

-- Enable RLS
alter table public.users enable row level security;
alter table public.wins enable row level security;
alter table public.app_monitors enable row level security;
alter table public.interceptions enable row level security;
alter table public.daily_logs enable row level security;

-- RLS policies (permissive for now - no auth required per spec)
create policy "Allow all access to users" on public.users for all using (true) with check (true);
create policy "Allow all access to wins" on public.wins for all using (true) with check (true);
create policy "Allow all access to app_monitors" on public.app_monitors for all using (true) with check (true);
create policy "Allow all access to interceptions" on public.interceptions for all using (true) with check (true);
create policy "Allow all access to daily_logs" on public.daily_logs for all using (true) with check (true);
