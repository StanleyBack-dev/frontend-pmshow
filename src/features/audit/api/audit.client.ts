import { apiRequest } from "@/shared/lib/api-client";
import type { AuditEntry, AuditedEntity } from "@/shared/contracts/api";

export const auditClient = {
  record: (entity: AuditedEntity, id: string) =>
    apiRequest<AuditEntry[]>(
      `/audit?${new URLSearchParams({ entidade: entity, id })}`,
    ),
};
