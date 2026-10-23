import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { clearSession, readAccessToken } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";
import type { ApiError } from "@/shared/contracts/api";

type RouteContext<P> = { params: Promise<P> };
type Handler<P> = (
  request: NextRequest,
  context: RouteContext<P>,
) => Promise<NextResponse>;

// CSRF defense for state-changing BFF routes: on top of SameSite=Lax cookies,
// mutations must come from this same origin.
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function errorResponse(status: number, error: ApiError): NextResponse {
  return NextResponse.json(error, { status });
}

/** Wraps a BFF route: origin check for mutations + uniform error mapping. */
export function bffRoute<P = Record<string, never>>(
  handler: Handler<P>,
): Handler<P> {
  return async (request, context) => {
    if (request.method !== "GET" && !isSameOrigin(request)) {
      return errorResponse(403, {
        code: "BFF_FORBIDDEN_ORIGIN",
        message: "Origem não permitida.",
      });
    }

    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(400, {
          code: "VALIDATION_FAILED",
          message: "Dados inválidos.",
          details: error.issues.map((issue) => issue.path.join(".")),
        });
      }
      if (error instanceof BackendError) {
        // Rejected session: drop the cookies so the UI goes to login.
        if (error.isUnauthorized && error.code !== "AUTH_INVALID_CREDENTIALS") {
          await clearSession();
        }
        return errorResponse(error.status, error.toApiError());
      }
      console.error("[bff] unexpected error", error);
      return errorResponse(500, {
        code: "BFF_UNEXPECTED",
        message: "Erro inesperado.",
      });
    }
  };
}

/** Parses the JSON body with `schema` (a ZodError becomes a 400). */
export async function readBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>,
): Promise<T> {
  return schema.parse(await request.json().catch(() => null));
}

/** The session's access token, or a 401 the UI turns into a login. */
export async function requireToken(): Promise<string> {
  const token = await readAccessToken();
  if (!token) {
    throw new BackendError(
      401,
      "AUTH_SESSION_MISSING",
      "Sessão ausente. Entre novamente.",
    );
  }
  return token;
}
