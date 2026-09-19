-- RMUTT Event Register — Row Level Security (RLS)
-- รันหลัง schema.sql และก่อน seed.sql

alter table public.events        enable row level security;
alter table public.registrations enable row level security;
alter table public.admins        enable row level security;

-- ---------------------------------------------------------------------------
-- events : อ่านได้สาธารณะ แต่เขียนไม่ได้
-- ---------------------------------------------------------------------------
drop policy if exists events_public_read on public.events;
create policy events_public_read
  on public.events
  for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.events from anon, authenticated;

-- ---------------------------------------------------------------------------
-- registrations : อ่านและอัปเดตสถานะเช็คอินได้เฉพาะแอดมิน
-- ---------------------------------------------------------------------------
drop policy if exists registrations_public_read   on public.registrations;
drop policy if exists registrations_public_insert on public.registrations;
drop policy if exists registrations_admin_read    on public.registrations;
drop policy if exists registrations_admin_update  on public.registrations;

revoke all on public.registrations from anon, authenticated;
grant select, update (checked_in) on public.registrations to authenticated;

-- R4 / AC-4.5 — อ่านรายชื่อได้เฉพาะแอดมิน
create policy registrations_admin_read
  on public.registrations
  for select
  to authenticated
  using (public.is_admin());

-- เช็คอินหน้างาน — อัปเดตได้เฉพาะแอดมิน
create policy registrations_admin_update
  on public.registrations
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- admins : อ่านได้เฉพาะผ่านฟังก์ชัน is_admin()
-- ---------------------------------------------------------------------------
revoke all on public.admins from anon, authenticated;

-- ---------------------------------------------------------------------------
-- สิทธิ์เรียกใช้ฟังก์ชัน
-- ---------------------------------------------------------------------------
revoke execute on function public.create_registration(uuid, text, text, text, text, text, text) from public;
revoke execute on function public.seats_taken(uuid) from public;
revoke execute on function public.is_admin() from public;

grant execute on function public.create_registration(uuid, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.seats_taken(uuid) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
