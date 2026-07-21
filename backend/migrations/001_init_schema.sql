-- CampusHub MVP schema for Supabase

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  bio text,
  role text not null default 'student' check (role in ('student','club_admin','super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clubs table
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  website text,
  logo_url text,
  is_approved boolean not null default false,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Club memberships
create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member','admin')),
  joined_at timestamptz not null default now(),
  unique(club_id, user_id)
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null,
  description text,
  location text,
  event_date timestamptz not null,
  capacity integer,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Event registrations
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- Announcements table
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_clubs_owner_id on public.clubs(owner_id);
create index if not exists idx_club_members_club_id on public.club_members(club_id);
create index if not exists idx_events_club_id on public.events(club_id);
create index if not exists idx_event_registrations_event_id on public.event_registrations(event_id);
create index if not exists idx_announcements_club_id on public.announcements(club_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.announcements enable row level security;

-- Policies: allow users to read public data and manage their own rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'clubs' AND policyname = 'Clubs are viewable by everyone'
  ) THEN
    CREATE POLICY "Clubs are viewable by everyone" ON public.clubs
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'clubs' AND policyname = 'Club owners can manage their clubs'
  ) THEN
    CREATE POLICY "Club owners can manage their clubs" ON public.clubs
      FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'club_members' AND policyname = 'Members are viewable by everyone'
  ) THEN
    CREATE POLICY "Members are viewable by everyone" ON public.club_members
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'club_members' AND policyname = 'Users can manage their own membership'
  ) THEN
    CREATE POLICY "Users can manage their own membership" ON public.club_members
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Events are viewable by everyone'
  ) THEN
    CREATE POLICY "Events are viewable by everyone" ON public.events
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Club admins can manage events'
  ) THEN
    CREATE POLICY "Club admins can manage events" ON public.events
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.club_members cm
          WHERE cm.club_id = events.club_id
            AND cm.user_id = auth.uid()
            AND cm.role = 'admin'
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.club_members cm
          WHERE cm.club_id = events.club_id
            AND cm.user_id = auth.uid()
            AND cm.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'event_registrations' AND policyname = 'Users can manage their own registrations'
  ) THEN
    CREATE POLICY "Users can manage their own registrations" ON public.event_registrations
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Announcements are viewable by everyone'
  ) THEN
    CREATE POLICY "Announcements are viewable by everyone" ON public.announcements
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'announcements' AND policyname = 'Club admins can manage announcements'
  ) THEN
    CREATE POLICY "Club admins can manage announcements" ON public.announcements
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.club_members cm
          WHERE cm.club_id = announcements.club_id
            AND cm.user_id = auth.uid()
            AND cm.role = 'admin'
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.club_members cm
          WHERE cm.club_id = announcements.club_id
            AND cm.user_id = auth.uid()
            AND cm.role = 'admin'
        )
      );
  END IF;
END $$;

-- Trigger to keep updated_at current
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_updated_at_clubs
before update on public.clubs
for each row execute function public.set_updated_at();

create trigger set_updated_at_events
before update on public.events
for each row execute function public.set_updated_at();

create trigger set_updated_at_announcements
before update on public.announcements
for each row execute function public.set_updated_at();
