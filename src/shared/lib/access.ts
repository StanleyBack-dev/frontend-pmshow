import type {
  Permission,
  SessionUser,
  UserGroup,
} from "@/shared/contracts/api";

// UI-side permission checks. They only decide what to show; the API checks
// every operation again.
export function can(
  user: Pick<SessionUser, "permissions">,
  ...required: Permission[]
): boolean {
  return required.every((permission) => user.permissions.includes(permission));
}

export function canAny(
  user: Pick<SessionUser, "permissions">,
  ...options: Permission[]
): boolean {
  return options.some((permission) => user.permissions.includes(permission));
}

/** Permissions that open some part of the admin area. */
export const ADMIN_AREA_PERMISSIONS: Permission[] = [
  "USERS_MANAGE",
  "PERMISSIONS_MANAGE",
  "AUDIT_READ",
];

/**
 * Groups `actor` may give to a user (mirrors the API rule: ADMIN_MASTER
 * assigns any group, everyone else only groups below their own).
 */
export function assignableGroups(actor: UserGroup): UserGroup[] {
  if (actor === "ADMIN_MASTER") return ["USER", "ADMIN", "ADMIN_MASTER"];
  if (actor === "ADMIN") return ["USER"];
  return [];
}
