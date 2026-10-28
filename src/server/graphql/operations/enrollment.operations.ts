import { graphql } from "@/server/graphql/generated";

// === public: code → form → request ===

export const verifyEnrollmentCodeDocument = graphql(`
  mutation VerifyEnrollmentCode($code: String!) {
    verifyEnrollmentCode(code: $code)
  }
`);

export const enrollmentInstrumentsDocument = graphql(`
  query EnrollmentInstruments($formToken: String!) {
    enrollmentInstruments(formToken: $formToken) {
      id
      name
    }
  }
`);

export const submitEnrollmentDocument = graphql(`
  mutation SubmitEnrollment($input: SubmitEnrollmentInput!) {
    submitEnrollment(input: $input)
  }
`);

// === manager: invites and review ===

export const enrollmentInviteFieldsFragment = graphql(`
  fragment EnrollmentInviteFields on EnrollmentInvite {
    id
    code
    label
    expiresAt
    revokedAt
    createdAt
    requestCount
  }
`);

export const enrollmentRequestFieldsFragment = graphql(`
  fragment EnrollmentRequestFields on EnrollmentRequest {
    id
    status
    fullName
    email
    phone
    military
    militaryId
    rank
    warName
    instruments {
      instrumentId
      primary
    }
    createdAt
    reviewedAt
    rejectionReason
    userId
    photoUrl
  }
`);

export const enrollmentInvitesDocument = graphql(`
  query EnrollmentInvites {
    enrollmentInvites {
      ...EnrollmentInviteFields
    }
  }
`);

export const createEnrollmentInviteDocument = graphql(`
  mutation CreateEnrollmentInvite($input: CreateEnrollmentInviteInput!) {
    createEnrollmentInvite(input: $input) {
      ...EnrollmentInviteFields
    }
  }
`);

export const revokeEnrollmentInviteDocument = graphql(`
  mutation RevokeEnrollmentInvite($id: ID!) {
    revokeEnrollmentInvite(id: $id) {
      ...EnrollmentInviteFields
    }
  }
`);

export const enrollmentRequestsDocument = graphql(`
  query EnrollmentRequests(
    $filter: EnrollmentRequestFilterInput
    $page: PageInput
  ) {
    enrollmentRequests(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        ...EnrollmentRequestFields
      }
    }
    pendingEnrollmentCount
  }
`);

export const approveEnrollmentRequestDocument = graphql(`
  mutation ApproveEnrollmentRequest(
    $id: ID!
    $data: EnrollmentDataInput!
    $group: UserGroup!
  ) {
    approveEnrollmentRequest(id: $id, data: $data, group: $group) {
      request {
        ...EnrollmentRequestFields
      }
      access {
        temporaryPassword
        emailSent
        user {
          ...UserAccountFields
        }
      }
    }
  }
`);

export const rejectEnrollmentRequestDocument = graphql(`
  mutation RejectEnrollmentRequest($id: ID!, $reason: String!) {
    rejectEnrollmentRequest(id: $id, reason: $reason) {
      ...EnrollmentRequestFields
    }
  }
`);
