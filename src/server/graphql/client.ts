import "server-only";
import type { TypedDocumentString } from "@/server/graphql/generated/graphql";
import { serverEnv } from "@/server/config/env";
import { BackendError } from "@/server/http/backend-error";

const DEFAULT_TIMEOUT_MS = 15_000;

type GraphqlRequest<TVariables> = {
  /** User session token (omitted for login and recovery). */
  token?: string | null;
  timeoutMs?: number;
} & (TVariables extends Record<string, never>
  ? { variables?: TVariables }
  : { variables: TVariables });

type GraphqlErrorPayload = {
  message?: string;
  extensions?: { code?: string; statusCode?: number; details?: unknown };
};

type GraphqlResponse<TResult> = {
  data?: TResult | null;
  errors?: GraphqlErrorPayload[];
};

// Single gateway from the BFF to the NestJS GraphQL API: attaches the
// internal key and the user's token, and turns every failure — network,
// HTTP or a GraphQL `errors` entry — into a BackendError carrying the
// backend's error code and HTTP-like status.
export async function backendGraphql<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  request: GraphqlRequest<TVariables>,
): Promise<TResult> {
  const env = serverEnv();
  const headers: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json",
    "x-internal-api-key": env.INTERNAL_API_KEY,
  };
  if (request.token) headers.authorization = `Bearer ${request.token}`;

  let response: Response;
  try {
    response = await fetch(new URL("/graphql", env.BACKEND_URL), {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: document.toString(),
        variables: request.variables ?? {},
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(request.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
  } catch {
    throw BackendError.unreachable();
  }

  const payload = (await response
    .json()
    .catch(() => null)) as GraphqlResponse<TResult> | null;

  const error = payload?.errors?.[0];
  if (error) {
    throw new BackendError(
      error.extensions?.statusCode ?? 500,
      error.extensions?.code ?? "GRAPHQL_ERROR",
      error.message ?? "Erro inesperado no servidor.",
      error.extensions?.details ?? undefined,
    );
  }
  if (!response.ok || !payload?.data) {
    throw new BackendError(
      response.status >= 400 ? response.status : 502,
      `HTTP_${response.status}`,
      "Erro inesperado no servidor.",
    );
  }
  return payload.data;
}
