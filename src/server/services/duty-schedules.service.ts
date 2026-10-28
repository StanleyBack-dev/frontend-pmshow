import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  cancelDutyScheduleDocument,
  createDutyScheduleDocument,
  dutyScheduleDocument,
  dutySchedulesPageDocument,
} from "@/server/graphql/operations/duty-schedules.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  DutySchedule,
  DutyScheduleDetail,
  DutyScheduleInput,
  DutyScheduleStatus,
} from "@/shared/contracts/duty-schedules";

// Expedientes (working days in batches): Gestor and Administrador geral.
export const dutySchedulesService = {
  async page(
    token: string,
    query: {
      search: string;
      status?: DutyScheduleStatus;
      page: number;
      limit: number;
    },
  ): Promise<Paginated<DutySchedule>> {
    const { dutySchedulesPage } = await backendGraphql(
      dutySchedulesPageDocument,
      {
        token,
        variables: {
          filter: { search: query.search || undefined, status: query.status },
          page: { page: query.page, limit: query.limit },
        },
      },
    );
    return dutySchedulesPage;
  },

  async get(token: string, id: string): Promise<DutyScheduleDetail> {
    const { dutySchedule } = await backendGraphql(dutyScheduleDocument, {
      token,
      variables: { id },
    });
    return dutySchedule;
  },

  async create(token: string, input: DutyScheduleInput): Promise<DutySchedule> {
    const { createDutySchedule } = await backendGraphql(
      createDutyScheduleDocument,
      // A month of days in one go: more room than the usual 15 s.
      { token, variables: { input }, timeoutMs: 60_000 },
    );
    return createDutySchedule;
  },

  async cancel(
    token: string,
    id: string,
    reason: string,
  ): Promise<DutySchedule> {
    const { cancelDutySchedule } = await backendGraphql(
      cancelDutyScheduleDocument,
      { token, variables: { id, input: { reason } } },
    );
    return cancelDutySchedule;
  },
};
