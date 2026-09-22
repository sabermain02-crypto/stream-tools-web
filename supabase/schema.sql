-- Stream Tools database schema
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  plan text not null default 'free' check (plan in ('free','premium')),
  role text not null default 'user' check (role in ('user','admin')),
  premium_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.premium_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  duration_days integer not null check (duration_days > 0),
  max_uses integer not null default 1 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.premium_redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.premium_codes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique(code_id,user_id)
);

alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('user','admin'));

create index if not exists premium_redemptions_user_idx on public.premium_redemptions(user_id);
create index if not exists premium_codes_code_idx on public.premium_codes(code);

alter table public.profiles enable row level security;
alter table public.premium_codes enable row level security;
alter table public.premium_redemptions enable row level security;

revoke all on public.premium_codes from anon, authenticated;
revoke all on public.premium_redemptions from anon, authenticated;
grant select, update on public.profiles to authenticated;

 drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "users can update own display name" on public.profiles;
create policy "users can update own display name" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id,email,display_name)
  values (new.id,new.email,coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email,''),'@',1)))
  on conflict (id) do update set email=excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.redeem_premium_code(p_code text)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  c premium_codes%rowtype;
  new_until timestamptz;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if trim(p_code) = '' then raise exception 'Premium code is required'; end if;

  select * into c from public.premium_codes
  where upper(code)=upper(trim(p_code))
    and used_count < max_uses
    and (expires_at is null or expires_at > now())
  for update;

  if not found then raise exception 'Kode premium tidak valid, sudah habis, atau sudah kedaluwarsa'; end if;

  if exists(select 1 from public.premium_redemptions where code_id=c.id and user_id=uid) then
    raise exception 'Kode ini sudah pernah digunakan di akun ini';
  end if;

  insert into public.premium_redemptions(code_id,user_id) values(c.id,uid);
  update public.premium_codes set used_count=used_count+1 where id=c.id;

  select greatest(coalesce(premium_until, now()), now()) + make_interval(days => c.duration_days)
    into new_until from public.profiles where id=uid;

  update public.profiles set plan='premium', premium_until=new_until, updated_at=now() where id=uid;
  return new_until;
end;
$$;

revoke all on function public.redeem_premium_code(text) from public;
grant execute on function public.redeem_premium_code(text) to authenticated;

-- Example code. Change it before sharing publicly.
-- insert into public.premium_codes(code,duration_days,max_uses) values ('ST-PREMIUM-30-TEST',30,1);
\n\n-- Admin helpers and policies\ncreate or replace function public.is_admin(uid uuid)\nreturns boolean\nlanguage sql\nstable\nsecurity definer\nset search_path = public\nas $$\n  select exists(select 1 from public.profiles where id = uid and role = 'admin');\n$$;\n\nrevoke all on function public.is_admin(uuid) from public;\ngrant execute on function public.is_admin(uuid) to authenticated;

-- Stream Tools owner: Firly / firlykarya@gmail.com
-- This makes the existing account an admin when this schema is run.
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = lower('firlykarya@gmail.com');
\n\ndrop policy if exists "admins can read all profiles" on public.profiles;\ncreate policy "admins can read all profiles" on public.profiles\n  for select to authenticated using (public.is_admin((select auth.uid())));\n\ndrop policy if exists "admins can update all profiles" on public.profiles;\ncreate policy "admins can update all profiles" on public.profiles\n  for update to authenticated\n  using (public.is_admin((select auth.uid())))\n  with check (public.is_admin((select auth.uid())));\n\ndrop policy if exists "admins can read premium codes" on public.premium_codes;\ncreate policy "admins can read premium codes" on public.premium_codes\n  for select to authenticated using (public.is_admin((select auth.uid())));\n\ndrop policy if exists "admins can insert premium codes" on public.premium_codes;\ncreate policy "admins can insert premium codes" on public.premium_codes\n  for insert to authenticated with check (public.is_admin((select auth.uid())));\n\ndrop policy if exists "admins can update premium codes" on public.premium_codes;\ncreate policy "admins can update premium codes" on public.premium_codes\n  for update to authenticated using (public.is_admin((select auth.uid()))) with check (public.is_admin((select auth.uid())));\n\ndrop policy if exists "admins can delete premium codes" on public.premium_codes;\ncreate policy "admins can delete premium codes" on public.premium_codes\n  for delete to authenticated using (public.is_admin((select auth.uid())));\n\ndrop policy if exists "admins can read redemptions" on public.premium_redemptions;\ncreate policy "admins can read redemptions" on public.premium_redemptions\n  for select to authenticated using (public.is_admin((select auth.uid())));\n