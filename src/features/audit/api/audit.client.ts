import { apiRequest } from "@/shared/lib/api-client";
import type { AuditedEntity, RecordStamp } from "@/shared/contracts/api";

export const auditClient = {
  record: (entity: AuditedEntity, id: string) =>
    apiRequest<RecordStamp | null>(
      `/audit?${new URLSearchParams({ entidade: entity, id })}`,
    ),
};
