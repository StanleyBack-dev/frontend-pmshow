import { graphql } from "@/server/graphql/generated";

export const broadcastFieldsFragment = graphql(`
  fragment BroadcastFields on Broadcast {
    id
    title
    body
    audience
    section
    eventId
    sendEmail
    recipients
    authorName
    createdAt
  }
`);

export const broadcastsDocument = graphql(`
  query Broadcasts {
    broadcasts {
      ...BroadcastFields
    }
  }
`);

export const sendBroadcastDocument = graphql(`
  mutation SendBroadcast($input: BroadcastInput!) {
    sendBroadcast(input: $input) {
      ...BroadcastFields
    }
  }
`);
