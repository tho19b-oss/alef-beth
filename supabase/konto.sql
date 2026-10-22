-- Konto für Alef Beth (Supabase Auth). Baut auf rangliste.sql auf und ist dort
-- schon eingespielt; die Datei liegt hier, damit sich das Projekt neu
-- aufsetzen lässt.
--
-- Jede App bekommt beim Start eine anonyme Sitzung (auth.uid()). Wer sein
-- Konto mit einer E-Mail sichert, bekommt ein Backup seines Fortschritts und
-- findet auf einem neuen Gerät seine Ranglisten-Gruppen wieder.
--
-- Die Ranglisten-Funktionen nehmen weiter ID und Geheimnis des Geräts an,
-- damit ältere App-Fassungen funktionieren. Zusätzlich gilt: Wer mit dem Konto
-- angemeldet ist, an das der Spieler gebunden ist, darf auch ohne Geheimnis.

alter table public.leaderboard_players
  add column user_id uuid unique references auth.users(id) on delete set null;

-- Fortschritt als Ganzes (der Inhalt von localStorage „alefbeth-state-v1“).
create table public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null check (pg_column_size(data) < 1000000),
  updated_at timestamptz not null default now()
);
alter table public.progress enable row level security;
revoke all on public.progress from anon, authenticated;

-- Geheimnis passt, oder der Spieler gehört zum angemeldeten Konto.
create or replace function public.leaderboard_check(p_id uuid, p_secret text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.leaderboard_players
    where id = p_id
      and (secret_hash = extensions.digest(coalesce(p_secret, ''), 'sha256')
           or (user_id is not null and user_id = auth.uid()))
  ) then
    raise exception 'unbekannter Spieler' using errcode = 'P0001';
  end if;
end $$;
revoke execute on function public.leaderboard_check(uuid, text) from public, anon, authenticated;

-- Stand hochladen. Legt den Spieler beim ersten Mal an. Kommt der Aufruf mit
-- einer Sitzung und hat der Spieler noch kein Konto, bindet er ihn daran
-- (sofern das Konto nicht schon einen anderen Spieler hat).
create or replace function public.leaderboard_sync(
  p_id uuid, p_secret text, p_name text, p_week date,
  p_week_xp integer, p_xp integer, p_streak integer
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_link uuid;
begin
  if v_uid is not null and not exists (select 1 from public.leaderboard_players where user_id = v_uid) then
    v_link := v_uid;
  end if;
  if exists (select 1 from public.leaderboard_players where id = p_id) then
    perform public.leaderboard_check(p_id, p_secret);
    update public.leaderboard_players
      set name = btrim(p_name), week = p_week, week_xp = p_week_xp, xp = p_xp,
          streak = p_streak, user_id = coalesce(user_id, v_link), updated_at = now()
      where id = p_id;
  else
    if char_length(coalesce(p_secret, '')) < 20 then
      raise exception 'Geheimnis zu kurz' using errcode = 'P0001';
    end if;
    insert into public.leaderboard_players (id, secret_hash, name, week, week_xp, xp, streak, user_id)
    values (p_id, extensions.digest(p_secret, 'sha256'), btrim(p_name), p_week, p_week_xp, p_xp, p_streak, v_link);
  end if;
end $$;

-- Spieler und Gruppen des angemeldeten Kontos, für ein neues Gerät.
-- null, wenn das Konto keinen Spieler hat.
create function public.leaderboard_me()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('id', p.id, 'groups', coalesce((
    select jsonb_agg(jsonb_build_object('code', g.code, 'name', g.name) order by m.joined_at)
    from public.leaderboard_members m join public.leaderboard_groups g on g.code = m.group_code
    where m.player_id = p.id), '[]'::jsonb))
  from public.leaderboard_players p where p.user_id = auth.uid();
$$;

-- Fortschritt sichern. Nur für Konten mit E-Mail: ein anonymes Konto ist mit
-- dem Gerät verloren, ein Backup dafür hilft niemandem.
create function public.progress_save(p_data jsonb)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare
  v_at timestamptz := now();
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'kein gesichertes Konto' using errcode = 'PT401';
  end if;
  insert into public.progress (user_id, data, updated_at) values (auth.uid(), p_data, v_at)
  on conflict (user_id) do update set data = excluded.data, updated_at = v_at;
  return v_at;
end $$;

create function public.progress_load()
returns table (data jsonb, updated_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select data, updated_at from public.progress where user_id = auth.uid();
$$;

-- Konto löschen: Backup, Spieler mit seinen Mitgliedschaften, leer gewordene
-- Gruppen und das Konto selbst.
create function public.account_delete()
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'nicht angemeldet' using errcode = 'PT401';
  end if;
  delete from public.leaderboard_players where user_id = v_uid;
  delete from public.leaderboard_groups g
    where not exists (select 1 from public.leaderboard_members m where m.group_code = g.code);
  delete from auth.users where id = v_uid;
end $$;

revoke execute on function public.leaderboard_me(), public.progress_save(jsonb),
  public.progress_load(), public.account_delete() from public, anon;
grant execute on function public.leaderboard_me(), public.progress_save(jsonb),
  public.progress_load(), public.account_delete() to authenticated;
