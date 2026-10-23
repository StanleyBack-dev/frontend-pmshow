import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import { pingDocument } from "@/server/graphql/operations/health.operations";
import { BackendError } from "@/server/http/backend-error";

export type BackendHealth =
  { ok: true } | { ok: false; code: string; message: string };

export const healthService = {
  /** Whether the GraphQL API answers and accepts this BFF's internal key. */
  async check(): Promise<BackendHealth> {
    try {
      await backendGraphql(pingDocument, {});
      return { ok: true };
    } catch (error) {
      if (error instanceof BackendError) {
        return { ok: false, code: error.code, message: error.message };
      }
      throw error;
    }
  },
};
