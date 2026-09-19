# กติกาโปรเจกต์ — RMUTT Event Register (มทร.ธัญบุรี)

โปรเจกต์นี้เป็นระบบลงทะเบียนและเช็คอินกิจกรรมของ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (RMUTT)
สร้างขึ้นตามมาตรฐานของหลักสูตรอบรมเชิงปฏิบัติการ AI-Assisted Coding

---

## 0. เอกสารอ้างอิง
1. `requirements.md` — สเปกและ acceptance criteria
2. `design.md` — โครงหน้าจอ flow และสถาปัตยกรรมความปลอดภัย
3. `db/schema.sql` — โครงตารางจริงและฟังก์ชัน security definer
4. `db/rls.sql` — สิทธิ์การเข้าถึงระดับแถว (Row Level Security)

---

## 1. Stack ที่ล็อกไว้
- Framework: Next.js App Router (TypeScript strict)
- UI: React 19 + Tailwind CSS v4
- ไอคอน: lucide-react
- ฐานข้อมูล: Supabase (PostgreSQL)
- ตัวแปร environment มีเพียง 2 ตัว: `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` เท่านั้น

---

## 2. ธีมและอัตลักษณ์ของ RMUTT
- ชื่องาน: ระบบลงทะเบียนกิจกรรม มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (RMUTT Event Register)
- สีหลัก: RMUTT Royal Navy `#132d77`, RMUTT Gold `#fbaf4a`, RMUTT Accent Blue `#0095eb`
- โลโก้: `public/image.png`
- ฟิลด์เฉพาะ: `shirt_size` (ขนาดเสื้อที่ระลึก)
- ภาษาบนหน้าจอ: ภาษาไทยทั้งหมด

---

## 3. กติกา R1–R5
- **R1:** อีเมลซ้ำในกิจกรรมเดียวกัน ลงทะเบียนไม่ได้ (เทียบแบบ case-insensitive)
- **R2:** ที่นั่งเต็มแล้วต้องปิดรับ (นับก่อน insert + trigger ล็อกแถวป้องกัน race condition)
- **R3:** ชื่อ อีเมล เบอร์โทรศัพท์ 10 หลัก บังคับกรอก + ยินยอม PDPA
- **R4:** หน้าแอดมินต้องผ่านการยืนยันตัวตน และต้องมีชื่อในตาราง `admins`
- **R5:** รหัสลงทะเบียนห้ามซ้ำ และสุ่มใหม่ (retry) ทันทีหากเกิด collision
