import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import { bandDashboardDocument } from "@/server/graphql/operations/dashboard.operations";
import type { BandDashboard } from "@/shared/contracts/dashboard";

export const dashboardService = {
  async get(token: string): Promise<BandDashboard> {
    const { bandDashboard } = await backendGraphql(bandDashboardDocument, {
      token,
    });
    return bandDashboard;
  },
};
