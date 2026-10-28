import { graphql } from "@/server/graphql/generated";

export const supportRequestFieldsFragment = graphql(`
  fragment SupportRequestFields on SupportRequest {
    id
    protocol
    userId
    userName
    warName
    category
    subject
    message
    status
    reply
    repliedAt
    repliedByName
    finalizedAt
    finalizedByName
    createdAt
  }
`);

export const supportPageDocument = graphql(`
  query SupportPage($page: PageInput) {
    supportQuota {
      limit
      sentToday
      remaining
      nextAllowedAt
    }
    mySupportRequests(page: $page) {
      items {
        ...SupportRequestFields
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const supportRequestsDocument = graphql(`
  query SupportRequests($status: SupportStatus, $page: PageInput) {
    supportRequests(status: $status, page: $page) {
      items {
        ...SupportRequestFields
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const sendSupportRequestDocument = graphql(`
  mutation SendSupportRequest($input: SupportRequestInput!) {
    sendSupportRequest(input: $input) {
      ...SupportRequestFields
    }
  }
`);

export const replySupportRequestDocument = graphql(`
  mutation ReplySupportRequest($id: ID!, $reply: String!) {
    replySupportRequest(id: $id, reply: $reply) {
      ...SupportRequestFields
    }
  }
`);

export const finalizeSupportRequestDocument = graphql(`
  mutation FinalizeSupportRequest($id: ID!) {
    finalizeSupportRequest(id: $id) {
      ...SupportRequestFields
    }
  }
`);
