-- RMUTT Event Register — schema
-- รันไฟล์นี้เป็นไฟล์แรกใน Supabase → SQL Editor
-- ลำดับ: schema.sql → rls.sql → seed.sql
-- ไฟล์นี้คือแหล่งความจริงเดียวของโครงตาราง

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- ตาราง events — กิจกรรม RMUTT
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  event_date  timestamptz not null,
  location    text,
  capacity    integer     not null check (capacity > 0),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ตาราง registrations — ผู้ลงทะเบียน
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid        not null references public.events (id) on delete cascade,
  full_name   text        not null,
  email       text        not null,
  phone       text        not null,
  faculty     text,
  shirt_size  text,
  ticket_code text        not null,
  checked_in  boolean     not null default false,
  consent_at  timestamptz,
  created_at  timestamptz not null default now(),

  -- R3: เบอร์โทรต้องเป็นตัวเลข 10 หลักพอดี
  constraint registrations_phone_format check (phone ~ '^[0-9]{10}$'),

  -- R3: อีเมลต้องมีรูปแบบถูกต้อง
  constraint registrations_email_format check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),

  constraint registrations_full_name_not_blank check (length(btrim(full_name)) > 0)
);

-- R1 — อีเมลซ้ำในกิจกรรมเดียวกันไม่ได้ (ไม่สนตัวพิมพ์เล็ก-ใหญ่)
create unique index if not exists registrations_event_email_unique
  on public.registrations (event_id, lower(email));

-- R5 — รหัสลงทะเบียนห้ามซ้ำทั้งระบบ
create unique index if not exists registrations_ticket_code_unique
  on public.registrations (ticket_code);

-- index ช่วยให้นับที่นั่งและเรียงตารางแอดมินเร็ว
create index if not exists registrations_event_created_idx
  on public.registrations (event_id, created_at desc);

-- ---------------------------------------------------------------------------
-- ตาราง admins — ผู้ดูแลระบบ (R4)
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- R2 — ที่นั่งเต็มแล้วต้องปิดรับ (ล็อกแถว events ป้องกัน race condition)
-- ---------------------------------------------------------------------------
create or replace function public.enforce_capacity()
returns trigger
language plpgsql
as $$
declare
  event_capacity integer;
  seats_taken    integer;
begin
  select capacity into event_capacity
    from public.events
   where id = new.event_id
     for update;

  if event_capacity is null then
    raise exception 'EVENT_NOT_FOUND';
  end if;

  select count(*) into seats_taken
    from public.registrations
   where event_id = new.event_id;

  if seats_taken >= event_capacity then
    raise exception 'EVENT_FULL';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_capacity on public.registrations;
create trigger trg_enforce_capacity
  before insert on public.registrations
  for each row
  execute function public.enforce_capacity();

-- ---------------------------------------------------------------------------
-- ฟังก์ชันนับที่นั่งที่ถูกจองไปแล้ว
-- ---------------------------------------------------------------------------
create or replace function public.seats_taken(p_event_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
    from public.registrations
   where event_id = p_event_id;
$$;

-- ---------------------------------------------------------------------------
-- ตรวจสอบว่าเป็นแอดมินหรือไม่ (R4)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- บันทึกผู้ลงทะเบียน 1 คน — รวมกติกา R1 R2 R5
-- ---------------------------------------------------------------------------
create or replace function public.create_registration(
  p_event_id    uuid,
  p_full_name   text,
  p_email       text,
  p_phone       text,
  p_faculty     text,
  p_shirt_size  text,
  p_ticket_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_taken    integer;
  v_email    text := btrim(coalesce(p_email, ''));
  v_name     text := btrim(coalesce(p_full_name, ''));
  v_phone    text := btrim(coalesce(p_phone, ''));
begin
  -- R3 — ด่านตรวจข้อมูลในระดับฟังก์ชัน DB
  if v_name = '' or v_email = '' or v_phone = '' or coalesce(p_ticket_code, '') = '' then
    return jsonb_build_object('ok', false, 'code', 'INVALID_INPUT');
  end if;
  if v_phone !~ '^[0-9]{10}$' then
    return jsonb_build_object('ok', false, 'code', 'INVALID_INPUT');
  end if;
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    return jsonb_build_object('ok', false, 'code', 'INVALID_INPUT');
  end if;

  -- R2 — ล็อกแถวกิจกรรมเพื่อป้องกันการลงทะเบียนเกินจำนวน
  select capacity into v_capacity
    from public.events
   where id = p_event_id
     for update;

  if v_capacity is null then
    return jsonb_build_object('ok', false, 'code', 'EVENT_NOT_FOUND');
  end if;

  select count(*) into v_taken
    from public.registrations
   where event_id = p_event_id;

  if v_taken >= v_capacity then
    return jsonb_build_object('ok', false, 'code', 'EVENT_FULL');
  end if;

  -- R1 — ด่านตรวจอีเมลซ้ำ
  if exists (
    select 1 from public.registrations
     where event_id = p_event_id
       and lower(email) = lower(v_email)
  ) then
    return jsonb_build_object('ok', false, 'code', 'DUPLICATE_EMAIL');
  end if;

  begin
    insert into public.registrations (
      event_id, full_name, email, phone, faculty, shirt_size, ticket_code, consent_at
    ) values (
      p_event_id,
      v_name,
      v_email,
      v_phone,
      nullif(btrim(coalesce(p_faculty, '')), ''),
      nullif(btrim(coalesce(p_shirt_size, '')), ''),
      p_ticket_code,
      now()
    );
  exception
    when unique_violation then
      if position('ticket_code' in sqlerrm) > 0 then
        return jsonb_build_object('ok', false, 'code', 'TICKET_CODE_COLLISION');
      end if;
      return jsonb_build_object('ok', false, 'code', 'DUPLICATE_EMAIL');
    when others then
      if sqlerrm like '%EVENT_FULL%' then
        return jsonb_build_object('ok', false, 'code', 'EVENT_FULL');
      end if;
      raise;
  end;

  return jsonb_build_object('ok', true, 'ticket_code', p_ticket_code);
end;
$$;
