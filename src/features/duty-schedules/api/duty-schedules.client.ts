import type {
  DutySchedule,
  DutyScheduleDetail,
  DutyScheduleInput,
} from "@/shared/contracts/duty-schedules";
import { apiRequest } from "@/shared/lib/api-client";

export const dutySchedulesClient = {
  create: (input: DutyScheduleInput) =>
    apiRequest<DutySchedule>("/duty-schedules", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  get: (id: string) => apiRequest<DutyScheduleDetail>(`/duty-schedules/${id}`),

  cancel: (id: string, reason: string) =>
    apiRequest<DutySchedule>(`/duty-schedules/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};
