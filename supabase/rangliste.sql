-- Rangliste für Alef Beth (Supabase-Projekt „alef-beth“, Region Frankfurt).
-- Stand der Datenbank als ein Skript. Eingespielt ist es dort schon; die
-- Datei liegt hier, damit sich das Projekt neu aufsetzen lässt.
--
-- Spieler (ein Gerät = ein Spieler), Gruppen mit Einladungscode,
-- Mitgliedschaften. Die App greift nie direkt auf die Tabellen zu, nur über
-- die Funktionen unten. Jedes Gerät hat ein zufälliges Geheimnis, die
-- Datenbank speichert nur dessen SHA-256.

create extension if not exists pgcrypto with schema extensions;

create table public.leaderboard_players (
  id uuid primary key,
  secret_hash bytea not null,
  name text not null check (char_length(name) between 1 and 24),
  week date not null,
  week_xp integer not null default 0 check (week_xp between 0 and 100000),
  xp integer not null default 0 check (xp between 0 and 100000000),
  streak integer not null default 0 check (streak between 0 and 100000),
  updated_at timestamptz not null default now()
);

create table public.leaderboard_groups (
  code text primary key check (code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  name text not null check (char_length(name) between 1 and 30),
  created_by uuid references public.leaderboard_players(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.leaderboard_members (
  group_code text not null references public.leaderboard_groups(code) on delete cascade,
  player_id uuid not null references public.leaderboard_players(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_code, player_id)
);
create index leaderboard_members_player on public.leaderboard_members(player_id);
create index leaderboard_groups_created_by on public.leaderboard_groups(created_by);

alter table public.leaderboard_players enable row level security;
alter table public.leaderboard_groups enable row level security;
alter table public.leaderboard_members enable row level security;
revoke all on public.leaderboard_players, public.leaderboard_groups, public.leaderboard_members from anon, authenticated;

-- Prüft das Geheimnis eines vorhandenen Spielers. Wirft, wenn es nicht passt.
create function public.leaderboard_check(p_id uuid, p_secret text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.leaderboard_players
    where id = p_id and secret_hash = extensions.digest(p_secret, 'sha256')
  ) then
    raise exception 'unbekannter Spieler' using errcode = 'P0001';
  end if;
end $$;
revoke execute on function public.leaderboard_check(uuid, text) from public, anon, authenticated;

-- Stand eines Geräts hochladen. Legt den Spieler beim ersten Mal an.
create function public.leaderboard_sync(
  p_id uuid, p_secret text, p_name text, p_week date,
  p_week_xp integer, p_xp integer, p_streak integer
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_hash bytea;
begin
  if char_length(coalesce(p_secret, '')) < 20 then
    raise exception 'Geheimnis zu kurz' using errcode = 'P0001';
  end if;
  v_hash := extensions.digest(p_secret, 'sha256');
  insert into public.leaderboard_players as p (id, secret_hash, name, week, week_xp, xp, streak)
  values (p_id, v_hash, btrim(p_name), p_week, p_week_xp, p_xp, p_streak)
  on conflict (id) do update
    set name = excluded.name, week = excluded.week, week_xp = excluded.week_xp,
        xp = excluded.xp, streak = excluded.streak, updated_at = now()
    where p.secret_hash = v_hash;
  if not found then
    raise exception 'unbekannter Spieler' using errcode = 'P0001';
  end if;
end $$;

-- Neue Gruppe anlegen und beitreten. Liefert den Einladungscode.
create function public.leaderboard_create_group(p_id uuid, p_secret text, p_name text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_code text;
  v_chars constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  perform public.leaderboard_check(p_id, p_secret);
  if (select count(*) from public.leaderboard_members where player_id = p_id) >= 10 then
    raise exception 'zu viele Gruppen' using errcode = 'P0001';
  end if;
  loop
    select string_agg(substr(v_chars, 1 + floor(random() * 32)::int, 1), '')
      into v_code from generate_series(1, 6);
    exit when not exists (select 1 from public.leaderboard_groups where code = v_code);
  end loop;
  insert into public.leaderboard_groups (code, name, created_by) values (v_code, btrim(p_name), p_id);
  insert into public.leaderboard_members (group_code, player_id) values (v_code, p_id);
  return v_code;
end $$;

-- Einer Gruppe beitreten. Liefert ihren Namen. Unbekannter Code: HTTP 404
-- (PostgREST setzt den Fehlercode PTxyz als Status xyz um).
create function public.leaderboard_join(p_id uuid, p_secret text, p_code text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_name text;
begin
  perform public.leaderboard_check(p_id, p_secret);
  select name into v_name from public.leaderboard_groups where code = upper(p_code);
  if v_name is null then
    raise exception 'Gruppe nicht gefunden' using errcode = 'PT404';
  end if;
  if not exists (select 1 from public.leaderboard_members where group_code = upper(p_code) and player_id = p_id)
     and (select count(*) from public.leaderboard_members where player_id = p_id) >= 10 then
    raise exception 'zu viele Gruppen' using errcode = 'P0001';
  end if;
  insert into public.leaderboard_members (group_code, player_id) values (upper(p_code), p_id)
  on conflict do nothing;
  return v_name;
end $$;

-- Gruppe verlassen. Die letzte Person löscht die Gruppe mit.
create function public.leaderboard_leave(p_id uuid, p_secret text, p_code text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.leaderboard_check(p_id, p_secret);
  delete from public.leaderboard_members where group_code = upper(p_code) and player_id = p_id;
  delete from public.leaderboard_groups g where g.code = upper(p_code)
    and not exists (select 1 from public.leaderboard_members m where m.group_code = g.code);
end $$;

-- Rangliste einer Gruppe. Wer den Code kennt, darf sie sehen.
-- Wochen-XP zählen nur, wenn sie aus der angefragten Woche stammen.
create function public.leaderboard_board(p_code text, p_week date)
returns table (player_id uuid, name text, week_xp integer, xp integer, streak integer, group_name text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.name,
         case when p.week = p_week then p.week_xp else 0 end,
         p.xp, p.streak, g.name
  from public.leaderboard_groups g
  join public.leaderboard_members m on m.group_code = g.code
  join public.leaderboard_players p on p.id = m.player_id
  where g.code = upper(p_code)
  order by 3 desc, p.xp desc, p.name;
$$;

-- Name einer Gruppe, für die Einladung vor dem Beitritt.
create function public.leaderboard_group(p_code text)
returns table (name text, members integer)
language sql stable security definer set search_path = '' as $$
  select g.name, (select count(*)::int from public.leaderboard_members m where m.group_code = g.code)
  from public.leaderboard_groups g where g.code = upper(p_code);
$$;

revoke execute on function public.leaderboard_sync(uuid, text, text, date, integer, integer, integer),
  public.leaderboard_create_group(uuid, text, text), public.leaderboard_join(uuid, text, text),
  public.leaderboard_leave(uuid, text, text), public.leaderboard_board(text, date),
  public.leaderboard_group(text) from public;
grant execute on function public.leaderboard_sync(uuid, text, text, date, integer, integer, integer),
  public.leaderboard_create_group(uuid, text, text), public.leaderboard_join(uuid, text, text),
  public.leaderboard_leave(uuid, text, text), public.leaderboard_board(text, date),
  public.leaderboard_group(text) to anon, authenticated;
