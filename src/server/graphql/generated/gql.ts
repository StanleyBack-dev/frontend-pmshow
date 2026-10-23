/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Users($filter: UserFilterInput, $page: PageInput) {\n    users(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...UserAccountFields\n      }\n    }\n  }\n": typeof types.UsersDocument,
    "\n  fragment UserAccountFields on UserAccount {\n    id\n    name\n    email\n    username\n    group\n    active\n    mustChangePassword\n    lockedUntil\n    locked\n    lastLoginAt\n    deactivatedAt\n    createdAt\n  }\n": typeof types.UserAccountFieldsFragmentDoc,
    "\n  query User($id: ID!) {\n    user(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.UserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation SetUserActive($id: ID!, $active: Boolean!) {\n    setUserActive(id: $id, active: $active) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.SetUserActiveDocument,
    "\n  mutation ResetUserPassword($id: ID!) {\n    resetUserPassword(id: $id) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": typeof types.ResetUserPasswordDocument,
    "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.UnlockUserDocument,
    "\n  mutation RevokeUserSessions($id: ID!) {\n    revokeUserSessions(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.RevokeUserSessionsDocument,
    "\n  query UserPermissions($id: ID!) {\n    userPermissions(id: $id) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": typeof types.UserPermissionsDocument,
    "\n  mutation SetUserPermissions($input: SetUserPermissionsInput!) {\n    setUserPermissions(input: $input) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": typeof types.SetUserPermissionsDocument,
    "\n  query AuditLogs($filter: AuditFilterInput, $page: PageInput) {\n    auditLogs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        actorId\n        actorName\n        action\n        entity\n        entityId\n        before\n        after\n        ip\n        createdAt\n      }\n    }\n  }\n": typeof types.AuditLogsDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n": typeof types.RefreshSessionDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n": typeof types.ChangeMyPasswordDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": typeof types.UpdateMyProfileDocument,
    "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n": typeof types.RequestPasswordRecoveryDocument,
    "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n": typeof types.VerifyPasswordRecoveryCodeDocument,
    "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n": typeof types.ResetPasswordWithRecoveryDocument,
};
const documents: Documents = {
    "\n  query Users($filter: UserFilterInput, $page: PageInput) {\n    users(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...UserAccountFields\n      }\n    }\n  }\n": types.UsersDocument,
    "\n  fragment UserAccountFields on UserAccount {\n    id\n    name\n    email\n    username\n    group\n    active\n    mustChangePassword\n    lockedUntil\n    locked\n    lastLoginAt\n    deactivatedAt\n    createdAt\n  }\n": types.UserAccountFieldsFragmentDoc,
    "\n  query User($id: ID!) {\n    user(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": types.UserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      ...UserAccountFields\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation SetUserActive($id: ID!, $active: Boolean!) {\n    setUserActive(id: $id, active: $active) {\n      ...UserAccountFields\n    }\n  }\n": types.SetUserActiveDocument,
    "\n  mutation ResetUserPassword($id: ID!) {\n    resetUserPassword(id: $id) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": types.ResetUserPasswordDocument,
    "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": types.UnlockUserDocument,
    "\n  mutation RevokeUserSessions($id: ID!) {\n    revokeUserSessions(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": types.RevokeUserSessionsDocument,
    "\n  query UserPermissions($id: ID!) {\n    userPermissions(id: $id) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": types.UserPermissionsDocument,
    "\n  mutation SetUserPermissions($input: SetUserPermissionsInput!) {\n    setUserPermissions(input: $input) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": types.SetUserPermissionsDocument,
    "\n  query AuditLogs($filter: AuditFilterInput, $page: PageInput) {\n    auditLogs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        actorId\n        actorName\n        action\n        entity\n        entityId\n        before\n        after\n        ip\n        createdAt\n      }\n    }\n  }\n": types.AuditLogsDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n": types.RefreshSessionDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": types.MeDocument,
    "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n": types.ChangeMyPasswordDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": types.UpdateMyProfileDocument,
    "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n": types.RequestPasswordRecoveryDocument,
    "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n": types.VerifyPasswordRecoveryCodeDocument,
    "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n": types.ResetPasswordWithRecoveryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Users($filter: UserFilterInput, $page: PageInput) {\n    users(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...UserAccountFields\n      }\n    }\n  }\n"): typeof import('./graphql').UsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserAccountFields on UserAccount {\n    id\n    name\n    email\n    username\n    group\n    active\n    mustChangePassword\n    lockedUntil\n    locked\n    lastLoginAt\n    deactivatedAt\n    createdAt\n  }\n"): typeof import('./graphql').UserAccountFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query User($id: ID!) {\n    user(id: $id) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').UserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n"): typeof import('./graphql').CreateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').UpdateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetUserActive($id: ID!, $active: Boolean!) {\n    setUserActive(id: $id, active: $active) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').SetUserActiveDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetUserPassword($id: ID!) {\n    resetUserPassword(id: $id) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n"): typeof import('./graphql').ResetUserPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').UnlockUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeUserSessions($id: ID!) {\n    revokeUserSessions(id: $id) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').RevokeUserSessionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserPermissions($id: ID!) {\n    userPermissions(id: $id) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n"): typeof import('./graphql').UserPermissionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetUserPermissions($input: SetUserPermissionsInput!) {\n    setUserPermissions(input: $input) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n"): typeof import('./graphql').SetUserPermissionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AuditLogs($filter: AuditFilterInput, $page: PageInput) {\n    auditLogs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        actorId\n        actorName\n        action\n        entity\n        entityId\n        before\n        after\n        ip\n        createdAt\n      }\n    }\n  }\n"): typeof import('./graphql').AuditLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n      }\n    }\n  }\n"): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n"): typeof import('./graphql').RefreshSessionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): typeof import('./graphql').LogoutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n"): typeof import('./graphql').ChangeMyPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n"): typeof import('./graphql').UpdateMyProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n"): typeof import('./graphql').RequestPasswordRecoveryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n"): typeof import('./graphql').VerifyPasswordRecoveryCodeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n"): typeof import('./graphql').ResetPasswordWithRecoveryDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
