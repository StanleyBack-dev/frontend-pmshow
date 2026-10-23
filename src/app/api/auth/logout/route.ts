import { NextResponse, type NextRequest } from "next/server";
import { clearSession, readAccessToken } from "@/server/auth/session";
import { bffRoute } from "@/server/http/route-handler";
import { authService } from "@/server/services/auth.service";

// Ends the session in the API (best effort) and always drops the cookies.
async function endSession(): Promise<void> {
  const token = await readAccessToken();
  if (token) await authService.logout(token).catch(() => undefined);
  await clearSession();
}

/** User-initiated logout (button). */
export const POST = bffRoute(async () => {
  await endSession();
  return NextResponse.json({ ok: true });
});

/** Target of server-side redirects when the API rejected the session. */
export async function GET(request: NextRequest) {
  await endSession();
  const url = new URL("/entrar", request.url);
  if (request.nextUrl.searchParams.get("reason") === "expired") {
    url.searchParams.set("expired", "1");
  }
  return NextResponse.redirect(url);
}
