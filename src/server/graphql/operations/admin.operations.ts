import { graphql } from "@/server/graphql/generated";

export const usersDocument = graphql(`
  query Users($filter: UserFilterInput, $page: PageInput) {
    users(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        ...UserAccountFields
      }
    }
  }
`);

export const userAccountFieldsFragment = graphql(`
  fragment UserAccountFields on UserAccount {
    id
    name
    email
    username
    group
    active
    mustChangePassword
    lockedUntil
    locked
    lastLoginAt
    deactivatedAt
    createdAt
  }
`);

export const userDocument = graphql(`
  query User($id: ID!) {
    user(id: $id) {
      ...UserAccountFields
    }
  }
`);

export const createUserDocument = graphql(`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      temporaryPassword
      emailSent
      user {
        ...UserAccountFields
      }
    }
  }
`);

export const updateUserDocument = graphql(`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserAccountFields
    }
  }
`);

export const setUserActiveDocument = graphql(`
  mutation SetUserActive($id: ID!, $active: Boolean!) {
    setUserActive(id: $id, active: $active) {
      ...UserAccountFields
    }
  }
`);

export const resetUserPasswordDocument = graphql(`
  mutation ResetUserPassword($id: ID!) {
    resetUserPassword(id: $id) {
      temporaryPassword
      emailSent
      user {
        ...UserAccountFields
      }
    }
  }
`);

export const unlockUserDocument = graphql(`
  mutation UnlockUser($id: ID!) {
    unlockUser(id: $id) {
      ...UserAccountFields
    }
  }
`);

export const revokeUserSessionsDocument = graphql(`
  mutation RevokeUserSessions($id: ID!) {
    revokeUserSessions(id: $id) {
      ...UserAccountFields
    }
  }
`);

export const userPermissionsDocument = graphql(`
  query UserPermissions($id: ID!) {
    userPermissions(id: $id) {
      effective
      defaults
      overrides {
        permission
        allowed
      }
    }
  }
`);

export const setUserPermissionsDocument = graphql(`
  mutation SetUserPermissions($input: SetUserPermissionsInput!) {
    setUserPermissions(input: $input) {
      effective
      defaults
      overrides {
        permission
        allowed
      }
    }
  }
`);

export const recordStampDocument = graphql(`
  query RecordStamp($entity: String!, $id: ID!) {
    recordStamp(entity: $entity, id: $id) {
      createdAt
      createdByName
      updatedAt
      updatedByName
    }
  }
`);
