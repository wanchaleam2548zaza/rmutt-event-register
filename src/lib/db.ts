import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";
import {
  ErrorCode,
  ERROR_MESSAGES,
  EventRow,
  RegistrationInput,
  RegistrationResult,
  RegistrationRow,
} from "./types";
import { generateTicketCode, normalizeEmail } from "./validate";

export async function getCurrentEvent(): Promise<EventRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as EventRow;
}

export async function getSeatsTaken(eventId: string): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("seats_taken", {
    p_event_id: eventId,
  });

  if (error) {
    return 0;
  }

  return typeof data === "number" ? data : 0;
}

export async function getSeatsLeft(
  eventId: string,
  capacity: number
): Promise<number> {
  const taken = await getSeatsTaken(eventId);
  return Math.max(0, capacity - taken);
}

export async function createRegistration(
  input: RegistrationInput
): Promise<RegistrationResult> {
  const supabase = getSupabase();
  const normalizedEmail = normalizeEmail(input.email);
  const maxRetries = 5;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const ticketCode = generateTicketCode();

    const { data, error } = await supabase.rpc("create_registration", {
      p_event_id: input.eventId,
      p_full_name: input.fullName.trim(),
      p_email: normalizedEmail,
      p_phone: input.phone.trim(),
      p_faculty: input.faculty?.trim() || null,
      p_shirt_size: input.shirtSize?.trim() || null,
      p_ticket_code: ticketCode,
    });

    if (error) {
      return {
        ok: false,
        code: "INTERNAL_ERROR",
        error: ERROR_MESSAGES.INTERNAL_ERROR,
      };
    }

    const res = data as { ok: boolean; code?: string; ticket_code?: string };

    if (res.ok) {
      return {
        ok: true,
        ticketCode: res.ticket_code || ticketCode,
      };
    }

    if (res.code === "TICKET_CODE_COLLISION") {
      // ชนรหัสตั๋ว ให้สุ่มใหม่และลองซ้ำ (R5)
      continue;
    }

    const code = (res.code as ErrorCode) || "INVALID_INPUT";
    return {
      ok: false,
      code,
      error: ERROR_MESSAGES[code] || ERROR_MESSAGES.INVALID_INPUT,
    };
  }

  return {
    ok: false,
    code: "TICKET_CODE_COLLISION",
    error: ERROR_MESSAGES.TICKET_CODE_COLLISION,
  };
}

export async function listRegistrations(
  adminClient: SupabaseClient,
  eventId: string
): Promise<RegistrationRow[]> {
  const { data, error } = await adminClient
    .from("registrations")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as RegistrationRow[];
}

export async function setCheckedIn(
  adminClient: SupabaseClient,
  registrationId: string,
  checkedIn: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await adminClient
    .from("registrations")
    .update({ checked_in: checkedIn })
    .eq("id", registrationId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
