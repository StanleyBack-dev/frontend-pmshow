import { graphql } from "@/server/graphql/generated";

export const assignmentFieldsFragment = graphql(`
  fragment AssignmentFields on Assignment {
    userId
    functionId
    functionName
    instrumentId
    instrumentName
    notes
    overrideReason
    ackStatus
    ackNote
    ackAt
    person {
      name
      warName
      rank
      registration
      phone
      section
    }
  }
`);

export const rosterFieldsFragment = graphql(`
  fragment RosterFields on Roster {
    eventId
    status
    version
    publishedAt
    uncoveredSections
    assignments {
      ...AssignmentFields
    }
  }
`);

export const rosterDocument = graphql(`
  query EventRoster($eventId: ID!) {
    eventRoster(eventId: $eventId) {
      ...RosterFields
    }
  }
`);

export const rosterCandidatesDocument = graphql(`
  query RosterCandidates($eventId: ID!) {
    rosterCandidates(eventId: $eventId) {
      userId
      name
      warName
      rank
      registration
      phone
      section
      memberStatus
      instruments {
        instrumentId
        name
        primary
      }
      functions {
        functionId
        name
      }
      blocker
      absence {
        type
        startsOn
        endsOn
      }
      busyWith {
        eventId
        title
      }
    }
  }
`);

export const myAssignmentFieldsFragment = graphql(`
  fragment MyAssignmentFields on MyAssignment {
    eventId
    functionId
    functionName
    instrumentId
    instrumentName
    ackStatus
    ackNote
    event {
      id
      title
      type
      status
      callTime
      startsAt
      endsAt
      venue {
        id
        name
      }
    }
  }
`);

export const myAssignmentsDocument = graphql(`
  query MyAssignments($acknowledged: Boolean) {
    myAssignments(acknowledged: $acknowledged) {
      ...MyAssignmentFields
    }
  }
`);

export const myAssignmentsPageDocument = graphql(`
  query MyAssignmentsPage($tab: MyAssignmentTab!, $page: PageInput) {
    myAssignmentsPage(tab: $tab, page: $page) {
      items {
        ...MyAssignmentFields
      }
      total
      page
      limit
      totalPages
    }
    myAssignmentCounts {
      acknowledged
      pending
      duty
    }
  }
`);

export const swapRequestsDocument = graphql(`
  query SwapRequests($page: PageInput) {
    swapRequests(page: $page) {
      items {
        ...MyAssignmentFields
        userId
        ackAt
        person {
          name
          warName
          rank
          section
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const keepOnRosterDocument = graphql(`
  mutation KeepOnRoster($eventId: ID!, $userId: ID!, $note: String) {
    keepOnRoster(eventId: $eventId, userId: $userId, note: $note) {
      userId
      ackStatus
    }
  }
`);

export const saveRosterDocument = graphql(`
  mutation SaveRoster($eventId: ID!, $input: RosterInput!) {
    saveRoster(eventId: $eventId, input: $input) {
      ...RosterFields
    }
  }
`);

export const publishRosterDocument = graphql(`
  mutation PublishRoster($eventId: ID!) {
    publishRoster(eventId: $eventId) {
      ...RosterFields
    }
  }
`);

export const acknowledgeRosterDocument = graphql(`
  mutation AcknowledgeRoster(
    $eventId: ID!
    $answer: AckAnswer!
    $note: String
  ) {
    acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {
      ackStatus
      ackNote
    }
  }
`);
