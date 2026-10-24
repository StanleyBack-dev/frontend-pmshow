import { graphql } from "@/server/graphql/generated";

export const absenceFieldsFragment = graphql(`
  fragment AbsenceFields on Absence {
    id
    userId
    userName
    warName
    type
    startsOn
    endsOn
    reason
    status
    reviewNote
    reviewedAt
    createdAt
  }
`);

export const myAbsencesDocument = graphql(`
  query MyAbsences {
    myAbsences {
      ...AbsenceFields
    }
  }
`);

export const absencesDocument = graphql(`
  query Absences($filter: AbsenceFilterInput) {
    absences(filter: $filter) {
      ...AbsenceFields
    }
  }
`);

export const requestAbsenceDocument = graphql(`
  mutation RequestAbsence($input: AbsenceInput!) {
    requestAbsence(input: $input) {
      ...AbsenceFields
    }
  }
`);

export const registerAbsenceDocument = graphql(`
  mutation RegisterAbsence($userId: ID!, $input: AbsenceInput!) {
    registerAbsence(userId: $userId, input: $input) {
      ...AbsenceFields
    }
  }
`);

export const reviewAbsenceDocument = graphql(`
  mutation ReviewAbsence($id: ID!, $approve: Boolean!, $note: String) {
    reviewAbsence(id: $id, approve: $approve, note: $note) {
      ...AbsenceFields
    }
  }
`);

export const cancelAbsenceDocument = graphql(`
  mutation CancelAbsence($id: ID!) {
    cancelAbsence(id: $id) {
      ...AbsenceFields
    }
  }
`);
