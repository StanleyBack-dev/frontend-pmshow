import "server-only";
import { cookies } from "next/headers";
import { serverEnv } from "@/server/config/env";

// Tokens live only in httpOnly cookies on the frontend's own domain: browser
// JavaScript can never read them.
//
// - access cookie: the short-lived access token. It expires a little before
//   the token, so "cookie present" means "token usable"; when it is gone the
//   proxy refreshes it from the refresh cookie before the page renders.
// - refresh cookie: the session's refresh token (lifetime of the session).
// - reset cookie: the password-recovery reset token, between the "code" and
//   the "new password" steps.

const EXPIRY_SKEW_MS = 30_000;
const RESET_COOKIE_MAX_AGE = 15 * 60;

export type SessionTokens = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type CookieSpec = {
  name: string;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  expires?: Date;
  maxAge?: number;
};

export function sessionCookieNames() {
  const base = serverEnv().SESSION_COOKIE_NAME;
  return { access: base, refresh: `${base}_refresh`, reset: `${base}_reset` };
}

function spec(
  name: string,
  value: string,
  lifetime: { expires: Date } | { maxAge: number },
): CookieSpec {
  return {
    name,
    value,
    httpOnly: true,
    secure: serverEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...lifetime,
  };
}

/** The two session cookies for a token pair (shared with the proxy). */
export function sessionCookieSpecs(tokens: SessionTokens): CookieSpec[] {
  const names = sessionCookieNames();
  const accessExpiry = new Date(
    new Date(tokens.accessTokenExpiresAt).getTime() - EXPIRY_SKEW_MS,
  );
  return [
    spec(names.access, tokens.accessToken, { expires: accessExpiry }),
    spec(names.refresh, tokens.refreshToken, {
      expires: new Date(tokens.refreshTokenExpiresAt),
    }),
  ];
}

export async function readAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(sessionCookieNames().access)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(sessionCookieNames().refresh)?.value ?? null;
}

/** Only callable from Route Handlers / Server Actions. */
export async function writeSession(tokens: SessionTokens): Promise<void> {
  const store = await cookies();
  for (const cookie of sessionCookieSpecs(tokens)) store.set(cookie);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  const names = sessionCookieNames();
  store.delete(names.access);
  store.delete(names.refresh);
}

export async function writeResetToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(
    spec(sessionCookieNames().reset, token, { maxAge: RESET_COOKIE_MAX_AGE }),
  );
}

export async function takeResetToken(): Promise<string | null> {
  const store = await cookies();
  const name = sessionCookieNames().reset;
  const value = store.get(name)?.value ?? null;
  store.delete(name);
  return value;
}
