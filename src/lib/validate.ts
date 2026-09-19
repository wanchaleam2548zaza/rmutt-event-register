import { ErrorCode, ERROR_MESSAGES, RegistrationInput } from "./types";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(trimmed);
}

export function validateRegistration(input: RegistrationInput): {
  valid: boolean;
  code?: ErrorCode;
  error?: string;
} {
  const fullName = input.fullName?.trim() || "";
  const email = input.email?.trim() || "";
  const phone = input.phone?.trim() || "";

  if (!fullName || !email || !phone) {
    return {
      valid: false,
      code: "MISSING_FIELD",
      error: ERROR_MESSAGES.MISSING_FIELD,
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      code: "INVALID_EMAIL",
      error: ERROR_MESSAGES.INVALID_EMAIL,
    };
  }

  if (!isValidPhone(phone)) {
    return {
      valid: false,
      code: "INVALID_PHONE",
      error: ERROR_MESSAGES.INVALID_PHONE,
    };
  }

  if (!input.consent) {
    return {
      valid: false,
      code: "CONSENT_REQUIRED",
      error: ERROR_MESSAGES.CONSENT_REQUIRED,
    };
  }

  return { valid: true };
}

export function generateTicketCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars.charAt(randomIndex);
  }
  return `RMUTT-${randomPart}`;
}
