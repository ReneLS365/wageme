-- Schema definition for Én app til felt + kontor
-- Dette script opretter alle tabeller, views og relationer.

-- Udvidelser
create extension if not exists "uuid-ossp";

-- Brugerinformationer (yderligere data udover auth.users)
create table if not exists public.users_info (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'worker',
  full_name text not null,
  created_at timestamp with time zone default now()
);

-- Projekter
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  owner_id uuid not null references auth.users(id),
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Medlemskab pr. projekt
create table if not exists public.project_members (
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('worker','manager','admin')),
  inserted_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Tidsregistreringer
create table if not exists public.time_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  project_id uuid not null references public.projects(id),
  start_at timestamptz not null,
  end_at timestamptz,
  type text not null check (type in ('stamp','pause')),
  comment text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ændringslog (append‑only)
create table if not exists public.change_logs (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id uuid not null,
  user_id uuid references auth.users(id),
  action text not null,
  changes jsonb,
  inserted_at timestamptz not null default now()
);

-- CountSheets genereret via Scafix
create table if not exists public.count_sheets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  data jsonb not null,
  created_by uuid not null references auth.users(id),
  status text not null check (status in ('draft','finalized')) default 'draft',
  inserted_at timestamptz not null default now()
);

-- Løn beregninger
create table if not exists public.wage_calculations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  period_start date not null,
  period_end date not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

-- Vedhæftede filer (f.eks. fotos, dokumenter)
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id uuid not null,
  url text not null,
  filename text not null,
  mime_type text not null,
  inserted_at timestamptz not null default now()
);

-- Eksportjobs til E-Komplet
create table if not exists public.export_jobs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('csv','xlsx','pdf')),
  status text not null check (status in ('pending','processing','completed','failed')) default 'pending',
  requested_by uuid not null references auth.users(id),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  url text
);

-- Web push notifikationer
create table if not exists public.notification_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  keys jsonb not null,
  inserted_at timestamptz not null default now()
);
