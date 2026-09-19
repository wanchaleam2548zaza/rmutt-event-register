// โครงสร้างประเภทข้อมูลของ RMUTT Event Register

export interface EventRow {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  location: string | null;
  capacity: number;
  created_at: string;
}

export interface RegistrationRow {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string;
  faculty: string | null;
  shirt_size: string | null;
  ticket_code: string;
  checked_in: boolean;
  consent_at: string | null;
  created_at: string;
}

export interface AdminRow {
  user_id: string;
  note: string | null;
  created_at: string;
}

export interface RegistrationInput {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  faculty?: string;
  shirtSize?: string;
  consent: boolean;
}

export type ErrorCode =
  | "MISSING_FIELD"
  | "INVALID_EMAIL"
  | "INVALID_PHONE"
  | "CONSENT_REQUIRED"
  | "DUPLICATE_EMAIL"
  | "EVENT_FULL"
  | "TICKET_CODE_COLLISION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "EVENT_NOT_FOUND"
  | "INVALID_INPUT"
  | "INTERNAL_ERROR";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  MISSING_FIELD: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
  INVALID_EMAIL: "รูปแบบอีเมลไม่ถูกต้อง",
  INVALID_PHONE: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก",
  CONSENT_REQUIRED: "กรุณายอมรับเงื่อนไขการเก็บข้อมูลส่วนบุคคลก่อนลงทะเบียน",
  DUPLICATE_EMAIL: "อีเมลนี้ลงทะเบียนกิจกรรมนี้ไปแล้ว",
  EVENT_FULL: "ขออภัย ที่นั่งเต็มแล้ว",
  TICKET_CODE_COLLISION: "ระบบออกรหัสลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
  UNAUTHORIZED: "กรุณาเข้าสู่ระบบก่อน",
  FORBIDDEN: "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแล (ไม่อยู่ในตาราง admins)",
  EVENT_NOT_FOUND: "ไม่พบข้อมูลกิจกรรม",
  INVALID_INPUT: "ข้อมูลที่ส่งมาไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
  INTERNAL_ERROR: "เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง",
};

export interface RegistrationResult {
  ok: boolean;
  ticketCode?: string;
  code?: ErrorCode;
  error?: string;
}
