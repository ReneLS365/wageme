-- Aktiver row level security og definér politikker

alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.time_entries enable row level security;
alter table public.count_sheets enable row level security;
alter table public.wage_calculations enable row level security;
alter table public.attachments enable row level security;
alter table public.export_jobs enable row level security;

-- Projekter: læsning kun for medlemmer
create policy projects_select on public.projects
  for select using (exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id and pm.user_id = auth.uid()
  ));

-- Projekter: indsættelse for alle autentificerede
create policy projects_insert on public.projects
  for insert with check (auth.role() = 'authenticated');

-- Projekter: opdatering for manager og admin
create policy projects_update on public.projects
  for update using (exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id and pm.user_id = auth.uid() and pm.role in ('manager','admin')
  ));

-- Projekter: sletning kun for admin
create policy projects_delete on public.projects
  for delete using (exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id and pm.user_id = auth.uid() and pm.role = 'admin'
  ));

-- Projektmedlemmer: læsning begrænset til egne projekter
create policy project_members_select on public.project_members
  for select using (project_id in (select project_id from public.project_members where user_id = auth.uid()));

-- Projektmedlemmer: indsættelse for manager/admin
create policy project_members_insert on public.project_members
  for insert with check (exists (
    select 1 from public.project_members pm
    where pm.project_id = new.project_id and pm.user_id = auth.uid() and pm.role in ('manager','admin')
  ));

-- Tidsregistrering: læsning af egne eller projektets poster (manager/admin)
create policy time_entries_select on public.time_entries
  for select using (
    time_entries.user_id = auth.uid()
    or exists (
      select 1 from public.project_members pm
      where pm.project_id = time_entries.project_id and pm.user_id = auth.uid() and pm.role in ('manager','admin')
    )
  );

-- Tidsregistrering: indsættelse når bruger er medlem
create policy time_entries_insert on public.time_entries
  for insert with check (exists (
    select 1 from public.project_members pm
    where pm.project_id = new.project_id and pm.user_id = auth.uid()
  ));

-- Tidsregistrering: opdatering kun af egne poster
create policy time_entries_update on public.time_entries
  for update using (time_entries.user_id = auth.uid());

-- Tidsregistrering: sletning kun af egne poster
create policy time_entries_delete on public.time_entries
  for delete using (time_entries.user_id = auth.uid());

-- CountSheets: læsning af projektets data
create policy count_sheets_select on public.count_sheets
  for select using (exists (
    select 1 from public.project_members pm
    where pm.project_id = count_sheets.project_id and pm.user_id = auth.uid()
  ));

-- CountSheets: indsættelse for manager/admin
create policy count_sheets_insert on public.count_sheets
  for insert with check (exists (
    select 1 from public.project_members pm
    where pm.project_id = new.project_id and pm.user_id = auth.uid() and pm.role in ('manager','admin')
  ));

-- CountSheets: opdatering for manager/admin
create policy count_sheets_update on public.count_sheets
  for update using (exists (
    select 1 from public.project_members pm
    where pm.project_id = count_sheets.project_id and pm.user_id = auth.uid() and pm.role in ('manager','admin')
  ));

-- CountSheets: sletning aldrig tilladt (immutable)
create policy count_sheets_delete on public.count_sheets
  for delete using (false);

-- Wage calculations: læsning af egne eller af service role
create policy wage_calculations_select on public.wage_calculations
  for select using (wage_calculations.user_id = auth.uid() or auth.role() = 'service_role');

-- Wage calculations: indsættelse kun for service role
create policy wage_calculations_insert on public.wage_calculations
  for insert with check (auth.role() = 'service_role');

-- Vedhæftninger: læsning hvis bruger er medlem af tilknyttet projekt
create policy attachments_select on public.attachments
  for select using (exists (
    select 1 from public.project_members pm
    where pm.project_id = attachments.entity_id and pm.user_id = auth.uid()
  ));

-- Vedhæftninger: indsættelse når bruger er medlem
create policy attachments_insert on public.attachments
  for insert with check (exists (
    select 1 from public.project_members pm
    where pm.project_id = new.entity_id and pm.user_id = auth.uid()
  ));

-- Vedhæftninger: sletning aldrig tilladt
create policy attachments_delete on public.attachments
  for delete using (false);

-- Eksportjobs: læsning når bruger er medlem
create policy export_jobs_select on public.export_jobs
  for select using (exists (
    select 1 from public.project_members pm
    where pm.project_id = export_jobs.project_id and pm.user_id = auth.uid()
  ));

-- Eksportjobs: indsættelse når bruger er medlem
create policy export_jobs_insert on public.export_jobs
  for insert with check (exists (
    select 1 from public.project_members pm
    where pm.project_id = new.project_id and pm.user_id = auth.uid()
  ));

-- Eksportjobs: opdatering aldrig tilladt (kun serverændrer status)
create policy export_jobs_update on public.export_jobs
  for update using (false);
