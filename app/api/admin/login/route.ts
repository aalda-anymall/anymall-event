import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  getAdminSessionCookieValue,
  isAdminPinConfigured,
  isValidAdminPin
} from "@/lib/admin-auth";

type LoginBody = {
  pin?: string;
};

export async function POST(request: NextRequest) {
  if (!isAdminPinConfigured()) {
    return NextResponse.json({ error: "ADMIN_PIN is not configured." }, { status: 500 });
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const pin = body.pin?.trim() ?? "";
  const isValid = await isValidAdminPin(pin);

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
  }

  const sessionToken = await getAdminSessionCookieValue();
  if (!sessionToken) {
    return NextResponse.json({ error: "ADMIN_PIN is not configured." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, getAdminSessionCookieOptions());
  return response;
}

