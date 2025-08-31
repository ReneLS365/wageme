-- Indlæs eksempeldata

-- Opret to brugere i auth.users (kun til test; i produktion oprettes brugere via Supabase Auth)
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'arbejder@example.com')
on conflict do nothing;

insert into public.users_info (user_id, role, full_name) values
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Administrator'),
  ('00000000-0000-0000-0000-000000000002', 'worker', 'Arbejder')
on conflict do nothing;

-- Opret et projekt og tilføj medlemmer
insert into public.projects (id, name, description, owner_id) values
  ('11111111-1111-1111-1111-111111111111', 'Demo Projekt', 'Eksempelprojekt for test', '00000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into public.project_members (project_id, user_id, role) values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'worker')
on conflict do nothing;

-- Opret eksempel time entries
insert into public.time_entries (id, user_id, project_id, start_at, end_at, type, comment) values
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', now() - interval '2 hours', now() - interval '1 hour', 'stamp', 'Første registrering'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', now() - interval '1 hour', now(), 'pause', 'Pause')
on conflict do nothing;
