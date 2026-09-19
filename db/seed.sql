-- RMUTT Event Register — ข้อมูลกิจกรรมเริ่มต้น
-- รันเป็นไฟล์สุดท้าย (หลัง schema.sql และ rls.sql) ใน Supabase → SQL Editor

insert into public.events (name, description, event_date, location, capacity)
values (
  'โครงการอบรมเชิงปฏิบัติการ AI-Assisted Coding สำหรับการพัฒนาเว็บแอปพลิเคชัน มทร.ธัญบุรี',
  'เรียนรู้การพัฒนาเว็บแอปพลิเคชันยุคใหม่ด้วย Next.js, Supabase, Tailwind CSS พร้อม AI Agentic Workflow มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (RMUTT)',
  '2026-10-01 09:00:00+07',
  'หอประชุมราชมงคล มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (มทร.ธัญบุรี)',
  50
);

-- ตรวจสอบข้อมูลกิจกรรม
select id, name, capacity, event_date from public.events order by created_at desc limit 1;

-- ===========================================================================
-- เพิ่มผู้ดูแลระบบ (R4)
-- หลังจากสร้าง User ใน Supabase Auth แล้ว ให้นำ email มาใส่ด้านล่างแล้วรัน
-- ===========================================================================
-- insert into public.admins (user_id, note)
-- select id, 'ผู้ดูแลระบบ RMUTT Event'
--   from auth.users
--  where email = 'admin@rmutt.ac.th'
-- on conflict (user_id) do nothing;
