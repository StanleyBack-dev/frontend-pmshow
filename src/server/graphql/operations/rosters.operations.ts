import { graphql } from "@/server/graphql/generated";

export const assignmentFieldsFragment = graphql(`
  fragment AssignmentFields on Assignment {
    userId
    role
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
      section
      memberStatus
      instruments {
        instrumentId
        name
        primary
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

export const myAssignmentsDocument = graphql(`
  query MyAssignments {
    myAssignments {
      eventId
      role
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
