alter table public.skin_moods
  drop constraint if exists skin_moods_moods_count_check;

alter table public.skin_moods
  add constraint skin_moods_moods_count_check
  check (coalesce(array_length(moods, 1), 0) between 1 and 2);

create unique index if not exists skin_moods_user_day_unique_idx
  on public.skin_moods (
    user_id,
    ((created_at at time zone 'America/Sao_Paulo')::date)
  );

drop policy if exists "Users can update own skin moods" on public.skin_moods;

create policy "Users can update own skin moods"
  on public.skin_moods
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
