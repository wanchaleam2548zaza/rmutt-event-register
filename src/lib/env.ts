// ตรวจสอบตัวแปร Environment สำหรับ Supabase (มีได้แค่ 2 ตัวและเปิดเผยได้ทั้งคู่)

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url && !anonKey) {
    throw new Error(
      "ยังไม่ได้ตั้งค่าตัวแปร NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ในไฟล์ .env.local"
    );
  }
  if (!url) {
    throw new Error(
      "ยังไม่ได้ตั้งค่าตัวแปร NEXT_PUBLIC_SUPABASE_URL ในไฟล์ .env.local"
    );
  }
  if (!anonKey) {
    throw new Error(
      "ยังไม่ได้ตั้งค่าตัวแปร NEXT_PUBLIC_SUPABASE_ANON_KEY ในไฟล์ .env.local"
    );
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx")
  );
}
