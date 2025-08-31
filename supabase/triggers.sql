-- Trigger functions og triggere til audit og tidsstempel

-- Funktion til at opdatere updated_at
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Funktion til at oprette en ændringslog. Gemmer både gamle og nye værdier som JSONB.
create or replace function public.record_change() returns trigger
language plpgsql as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.change_logs (entity_type, entity_id, user_id, action, changes)
    values (TG_TABLE_NAME, new.id, coalesce(auth.uid(), new.user_id), TG_OP, to_jsonb(new));
    return new;
  elsif (TG_OP = 'UPDATE') then
    insert into public.change_logs (entity_type, entity_id, user_id, action, changes)
    values (TG_TABLE_NAME, new.id, coalesce(auth.uid(), new.user_id), TG_OP, jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new)));
    return new;
  elsif (TG_OP = 'DELETE') then
    insert into public.change_logs (entity_type, entity_id, user_id, action, changes)
    values (TG_TABLE_NAME, old.id, coalesce(auth.uid(), old.user_id), TG_OP, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

-- Tilføj set_updated_at triggere til relevante tabeller
drop trigger if exists trg_set_updated_at_projects on public.projects;
create trigger trg_set_updated_at_projects
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_set_updated_at_time_entries on public.time_entries;
create trigger trg_set_updated_at_time_entries
before update on public.time_entries
for each row execute function public.set_updated_at();

-- Registrer record_change triggere for alle domænetabeller
do $$ declare t text; begin
  for t in select unnest(array['projects','project_members','time_entries','count_sheets','wage_calculations','attachments','export_jobs','notification_subscriptions']) loop
    execute format('drop trigger if exists trg_change_%1$s on public.%1$s', t);
    execute format('create trigger trg_change_%1$s after insert or update or delete on public.%1$s for each row execute function public.record_change()', t);
  end loop;
end $$;
