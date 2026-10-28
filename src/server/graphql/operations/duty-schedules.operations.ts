import { graphql } from "@/server/graphql/generated";

export const dutyScheduleFieldsFragment = graphql(`
  fragment DutyScheduleFields on DutySchedule {
    id
    title
    startsOn
    endsOn
    venueId
    uniform
    notes
    audienceKind
    sections
    status
    cancellationReason
    dayCount
    memberCount
    createdAt
  }
`);

export const dutySchedulesPageDocument = graphql(`
  query DutySchedulesPage($filter: DutyScheduleFilterInput, $page: PageInput) {
    dutySchedulesPage(filter: $filter, page: $page) {
      items {
        ...DutyScheduleFields
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const dutyScheduleDocument = graphql(`
  query DutySchedule($id: ID!) {
    dutySchedule(id: $id) {
      id
      title
      startsOn
      endsOn
      venueId
      uniform
      notes
      audienceKind
      sections
      status
      cancellationReason
      dayCount
      memberCount
      createdAt
      venue {
        id
        name
        fullAddress
      }
      days {
        id
        status
        startsAt
        endsAt
      }
      members {
        userId
        name
        profile {
          warName
          rank
          section
        }
      }
    }
  }
`);

export const createDutyScheduleDocument = graphql(`
  mutation CreateDutySchedule($input: DutyScheduleInput!) {
    createDutySchedule(input: $input) {
      ...DutyScheduleFields
    }
  }
`);

export const cancelDutyScheduleDocument = graphql(`
  mutation CancelDutySchedule($id: ID!, $input: CancelDutyScheduleInput!) {
    cancelDutySchedule(id: $id, input: $input) {
      ...DutyScheduleFields
    }
  }
`);
