import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readAccessToken } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";
import { authService } from "@/server/services/auth.service";
import type { SessionUser } from "@/shared/contracts/api";

/**
 * Runs a backend call with the current session from a Server Component.
 * Cookies can't be changed during render, so a session the backend rejects
 * goes to the logout route, which clears the cookies and lands on /entrar.
 */
export async function authed<T>(
  call: (token: string) => Promise<T>,
): Promise<T> {
  const token = await readAccessToken();
  if (!token) redirect("/entrar");
  try {
    return await call(token);
  } catch (error) {
    if (error instanceof BackendError && error.isUnauthorized) {
      redirect("/api/auth/logout?reason=expired");
    }
    throw error;
  }
}

/** The signed-in user, fetched once per request (layout + page share it). */
export const getSessionUser = cache((): Promise<SessionUser> =>
  authed((token) => authService.me(token)),
);
