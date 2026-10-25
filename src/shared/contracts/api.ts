// Contract types shared by the BFF routes and the UI — types only, no runtime
// code. Dates are ISO strings. Enums come from the GraphQL schema
// (codegen: shared/graphql/schema-enums.ts).
import type { Permission, UserGroup } from "@/shared/graphql/schema-enums";

export type { Permission, UserGroup };

/** Error shape returned by every BFF route. */
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SessionUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  group: UserGroup;
  mustChangePassword: boolean;
  permissions: Permission[];
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  username: string;
  group: UserGroup;
  active: boolean;
  mustChangePassword: boolean;
  lockedUntil: string | null;
  /** Locked right now by failed logins (computed by the API). */
  locked: boolean;
  lastLoginAt: string | null;
  deactivatedAt: string | null;
  createdAt: string;
};

/** Shown once to the admin who generated it. */
export type TemporaryAccess = {
  user: UserAccount;
  temporaryPassword: string;
  emailSent: boolean;
};

export type UserInput = {
  name: string;
  email: string;
  username: string;
  group: UserGroup;
};

export type PermissionMatrix = {
  effective: Permission[];
  defaults: Permission[];
  overrides: { permission: Permission; allowed: boolean }[];
};

/** Records whose trail the tables show (entity names of the audit log). */
export const AUDITED_ENTITIES = [
  "song",
  "artist",
  "user",
  "member",
  "event",
  "venue",
] as const;
export type AuditedEntity = (typeof AUDITED_ENTITIES)[number];

export type AuditEntry = {
  id: string;
  actorId: string | null;
  actorName: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
};
