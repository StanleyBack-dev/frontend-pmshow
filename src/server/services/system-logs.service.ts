import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  reportClientErrorDocument,
  systemLogSummaryDocument,
  systemLogsDocument,
} from "@/server/graphql/operations/system-logs.operations";
import type {
  SystemLog,
  SystemLogFilter,
  SystemLogPage,
  SystemLogSummary,
} from "@/shared/contracts/system-logs";

// The API sends level and category as plain strings; they are always one of
// the known values.
export const systemLogsService = {
  async list(
    token: string,
    filter: SystemLogFilter,
    page: { page: number; limit: number },
  ): Promise<SystemLogPage> {
    const { systemLogs } = await backendGraphql(systemLogsDocument, {
      token,
      variables: { filter, page },
    });
    return { ...systemLogs, items: systemLogs.items as SystemLog[] };
  },

  async summary(token: string): Promise<SystemLogSummary[]> {
    const { systemLogSummary } = await backendGraphql(
      systemLogSummaryDocument,
      { token },
    );
    return systemLogSummary as SystemLogSummary[];
  },

  async reportClientError(
    token: string,
    report: { message: string; url: string; digest: string | null },
  ): Promise<void> {
    await backendGraphql(reportClientErrorDocument, {
      token,
      variables: report,
    });
  },
};
