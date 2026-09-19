import { NextRequest, NextResponse } from "next/server";
import { createRegistration, getCurrentEvent } from "@/lib/db";
import { validateRegistration } from "@/lib/validate";
import { ERROR_MESSAGES, RegistrationInput } from "@/lib/types";

export async function GET() {
  try {
    const event = await getCurrentEvent();
    if (!event) {
      return NextResponse.json(
        { ok: false, error: ERROR_MESSAGES.EVENT_NOT_FOUND },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, event });
  } catch {
    return NextResponse.json(
      { ok: false, error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let eventId = body.eventId;
    if (!eventId) {
      const event = await getCurrentEvent();
      if (!event) {
        return NextResponse.json(
          { ok: false, error: ERROR_MESSAGES.EVENT_NOT_FOUND },
          { status: 404 }
        );
      }
      eventId = event.id;
    }

    const input: RegistrationInput = {
      eventId,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      faculty: body.faculty,
      shirtSize: body.shirtSize,
      consent: Boolean(body.consent),
    };

    // R3 — ตรวจสอบข้อมูลซ้ำที่เซิร์ฟเวอร์
    const validation = validateRegistration(input);
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, code: validation.code, error: validation.error },
        { status: 400 }
      );
    }

    // บันทึกผ่าน createRegistration (จัดการ R1, R2, R5)
    const result = await createRegistration(input);

    if (!result.ok) {
      const statusCode =
        result.code === "EVENT_FULL"
          ? 409
          : result.code === "DUPLICATE_EMAIL"
          ? 409
          : result.code === "TICKET_CODE_COLLISION"
          ? 500
          : 400;

      return NextResponse.json(result, { status: statusCode });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INTERNAL_ERROR",
        error: ERROR_MESSAGES.INTERNAL_ERROR,
      },
      { status: 500 }
    );
  }
}
