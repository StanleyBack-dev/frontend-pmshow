import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  auditLogsDocument,
  createUserDocument,
  resetUserPasswordDocument,
  revokeUserSessionsDocument,
  setUserActiveDocument,
  setUserPermissionsDocument,
  unlockUserDocument,
  updateUserDocument,
  userDocument,
  userPermissionsDocument,
  usersDocument,
} from "@/server/graphql/operations/admin.operations";
import type {
  AuditEntry,
  Paginated,
  Permission,
  PermissionMatrix,
  TemporaryAccess,
  UserAccount,
  UserGroup,
  UserInput,
} from "@/shared/contracts/api";

export type UserListQuery = {
  limit?: number;
  search?: string;
  group?: UserGroup;
  active?: boolean;
  page: number;
};

const PAGE_SIZE = 20;

export const adminService = {
  async listUsers(
    token: string,
    query: UserListQuery,
  ): Promise<Paginated<UserAccount>> {
    const { users } = await backendGraphql(usersDocument, {
      token,
      variables: {
        filter: {
          search: query.search || undefined,
          group: query.group,
          active: query.active,
        },
        page: { page: query.page, limit: query.limit ?? PAGE_SIZE },
      },
    });
    return users;
  },

  async getUser(token: string, id: string): Promise<UserAccount> {
    const { user } = await backendGraphql(userDocument, {
      token,
      variables: { id },
    });
    return user;
  },

  async createUser(token: string, input: UserInput): Promise<TemporaryAccess> {
    const { createUser } = await backendGraphql(createUserDocument, {
      token,
      variables: { input },
    });
    return createUser;
  },

  async updateUser(
    token: string,
    id: string,
    input: Partial<UserInput>,
  ): Promise<UserAccount> {
    const { updateUser } = await backendGraphql(updateUserDocument, {
      token,
      variables: { id, input },
    });
    return updateUser;
  },

  async setActive(
    token: string,
    id: string,
    active: boolean,
  ): Promise<UserAccount> {
    const { setUserActive } = await backendGraphql(setUserActiveDocument, {
      token,
      variables: { id, active },
    });
    return setUserActive;
  },

  async resetPassword(token: string, id: string): Promise<TemporaryAccess> {
    const { resetUserPassword } = await backendGraphql(
      resetUserPasswordDocument,
      { token, variables: { id } },
    );
    return resetUserPassword;
  },

  async unlock(token: string, id: string): Promise<UserAccount> {
    const { unlockUser } = await backendGraphql(unlockUserDocument, {
      token,
      variables: { id },
    });
    return unlockUser;
  },

  async revokeSessions(token: string, id: string): Promise<UserAccount> {
    const { revokeUserSessions } = await backendGraphql(
      revokeUserSessionsDocument,
      { token, variables: { id } },
    );
    return revokeUserSessions;
  },

  async getPermissions(token: string, id: string): Promise<PermissionMatrix> {
    const { userPermissions } = await backendGraphql(userPermissionsDocument, {
      token,
      variables: { id },
    });
    return userPermissions;
  },

  async setPermissions(
    token: string,
    id: string,
    permissions: Permission[] | null,
  ): Promise<PermissionMatrix> {
    const { setUserPermissions } = await backendGraphql(
      setUserPermissionsDocument,
      {
        token,
        variables: {
          input: {
            userId: id,
            useGroupDefaults: permissions === null,
            permissions: permissions ?? undefined,
          },
        },
      },
    );
    return setUserPermissions;
  },

  /** The trail of one record, newest first (at most 50 entries). */
  async recordAudit(
    token: string,
    entity: string,
    entityId: string,
  ): Promise<AuditEntry[]> {
    const { auditLogs } = await backendGraphql(auditLogsDocument, {
      token,
      variables: { filter: { entity, entityId }, page: { page: 1, limit: 50 } },
    });
    return auditLogs.items;
  },

  async auditLogs(
    token: string,
    page: number,
    limit = 10,
  ): Promise<Paginated<AuditEntry>> {
    const { auditLogs } = await backendGraphql(auditLogsDocument, {
      token,
      variables: { page: { page, limit } },
    });
    return auditLogs;
  },
};
