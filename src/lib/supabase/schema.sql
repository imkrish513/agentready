-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  target_company text,
  interview_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Problems table
create table public.problems (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  category text not null,
  description_md text not null,
  total_duration_minutes integer not null default 45,
  phases jsonb not null default '[]',
  files jsonb not null default '[]',
  test_cases jsonb not null default '[]',
  canonical_solution text,
  ai_bug_instructions text,
  created_at timestamptz default now()
);

-- Sessions table
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  problem_id uuid references public.problems(id) not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  help_mode boolean default false,
  current_phase integer default 0,
  phases_completed integer default 0,
  phases_skipped integer default 0,
  total_ai_messages integer default 0,
  ai_edits_accepted integer default 0,
  ai_edits_rejected integer default 0,
  test_runs integer default 0,
  lines_written integer default 0,
  lines_ai_accepted integer default 0,
  phase1_answers jsonb default '{}',
  chat_transcript jsonb default '[]',
  editor_state jsonb default '{}',
  score_approach integer,
  score_control integer,
  score_verification integer,
  score_communication integer,
  score_rationale jsonb,
  status text default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz default now()
);

-- Bug Reports table
create table public.bug_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  problem_id uuid references public.problems(id),
  session_id uuid references public.sessions(id),
  bug_type text not null check (bug_type in ('ai_wrong', 'code_wont_run', 'problem_text', 'ui_bug', 'other')),
  description text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.problems enable row level security;
alter table public.sessions enable row level security;
alter table public.bug_reports enable row level security;

-- Profiles: users can read and update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Problems: all authenticated users can read problems
create policy "Anyone can view problems" on public.problems for select using (true);

-- Sessions: users can CRUD their own sessions
create policy "Users can view own sessions" on public.sessions for select using (auth.uid() = user_id);
create policy "Users can create own sessions" on public.sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.sessions for update using (auth.uid() = user_id);

-- Bug Reports: users can create and view their own
create policy "Users can create bug reports" on public.bug_reports for insert with check (auth.uid() = user_id);
create policy "Users can view own bug reports" on public.bug_reports for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
