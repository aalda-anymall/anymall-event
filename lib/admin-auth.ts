const ADMIN_SESSION_SALT = "anymall-admin-session-v1";

export const ADMIN_SESSION_COOKIE = "admin_session";

function normalizePin(pin: string): string {
  return pin.trim();
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(hashBuffer));
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return diff === 0;
}

function getConfiguredAdminPin(): string | null {
  const pin = process.env.ADMIN_PIN?.trim();
  return pin ? pin : null;
}

async function buildSessionTokenFromPin(pin: string): Promise<string> {
  const normalizedPin = normalizePin(pin);
  const digest = await sha256(`${ADMIN_SESSION_SALT}:${normalizedPin}`);
  return `v1.${digest}`;
}

export async function getAdminSessionCookieValue(): Promise<string | null> {
  const configuredPin = getConfiguredAdminPin();
  if (!configuredPin) {
    return null;
  }

  return buildSessionTokenFromPin(configuredPin);
}

export async function isValidAdminPin(pin: string): Promise<boolean> {
  const configuredPin = getConfiguredAdminPin();
  if (!configuredPin) {
    return false;
  }

  const expectedToken = await buildSessionTokenFromPin(configuredPin);
  const incomingToken = await buildSessionTokenFromPin(pin);
  return constantTimeEqual(incomingToken, expectedToken);
}

export async function isValidAdminSessionToken(token?: string | null): Promise<boolean> {
  if (!token) {
    return false;
  }

  const expectedToken = await getAdminSessionCookieValue();
  if (!expectedToken) {
    return false;
  }

  return constantTimeEqual(token, expectedToken);
}

export function isAdminPinConfigured(): boolean {
  return Boolean(getConfiguredAdminPin());
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  };
}

