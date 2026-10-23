import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieNames, sessionCookieSpecs } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";
import { authService } from "@/server/services/auth.service";

// Pages reachable without a session. Someone already signed in is sent home.
const PUBLIC_PAGES = new Set(["/entrar", "/recuperar-senha"]);

// Keeps the session usable before anything renders. The access cookie
// expires just before its token; when it is gone but the refresh cookie is
// there, a new access token is fetched and written both to the response (for
// the browser) and to this request (so the page rendering now already sees
// it). Authorization itself is always enforced by the API.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const names = sessionCookieNames();
  const hasAccess = request.cookies.has(names.access);
  const refreshToken = request.cookies.get(names.refresh)?.value;

  if (PUBLIC_PAGES.has(pathname)) {
    return hasAccess
      ? NextResponse.redirect(new URL("/inicio", request.url))
      : NextResponse.next();
  }
  if (hasAccess) return NextResponse.next();

  let expired = false;
  if (refreshToken) {
    try {
      const specs = sessionCookieSpecs(await authService.refresh(refreshToken));
      for (const cookie of specs)
        request.cookies.set(cookie.name, cookie.value);
      const response = NextResponse.next({
        request: { headers: request.headers },
      });
      for (const cookie of specs) response.cookies.set(cookie);
      return response;
    } catch (error) {
      // API down: let the request through; the page shows its own error.
      if (
        error instanceof BackendError &&
        error.code === "BACKEND_UNREACHABLE"
      ) {
        return NextResponse.next();
      }
      expired = true;
    }
  }

  const response = pathname.startsWith("/api/")
    ? NextResponse.json(
        {
          code: "AUTH_SESSION_MISSING",
          message: "Sessão ausente. Entre novamente.",
        },
        { status: 401 },
      )
    : NextResponse.redirect(loginUrl(request, expired));
  response.cookies.delete(names.access);
  response.cookies.delete(names.refresh);
  return response;
}

function loginUrl(request: NextRequest, expired: boolean): URL {
  const url = new URL("/entrar", request.url);
  const target = request.nextUrl.pathname + request.nextUrl.search;
  if (target !== "/" && target !== "/inicio")
    url.searchParams.set("next", target);
  if (expired) url.searchParams.set("expired", "1");
  return url;
}

export const config = {
  matcher: [
    // Everything except static assets, generated icons and the public auth
    // endpoints (login, logout, password recovery).
    "/((?!_next/static|_next/image|icon.svg|apple-icon|pwa-icon|manifest.webmanifest|robots.txt|api/auth/).*)",
  ],
};
