import { graphql } from "@/server/graphql/generated";

export const memberProfileFieldsFragment = graphql(`
  fragment MemberProfileFields on MemberProfile {
    userId
    warName
    rank
    registration
    phone
    section
    status
    notes
    birthDate
    joinedOn
    updatedAt
    instruments {
      instrumentId
      name
      primary
    }
    functions {
      functionId
      name
    }
  }
`);

export const rosterDocument = graphql(`
  query Roster($filter: RosterFilterInput, $page: PageInput) {
    roster(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        userId
        name
        username
        active
        photoUrl
        profile {
          ...MemberProfileFields
        }
      }
    }
  }
`);

export const memberProfileDocument = graphql(`
  query MemberProfile($userId: ID!) {
    memberProfile(userId: $userId) {
      ...MemberProfileFields
    }
  }
`);

export const myMemberProfileDocument = graphql(`
  query MyMemberProfile {
    myMemberProfile {
      ...MemberProfileFields
    }
  }
`);

export const saveMemberProfileDocument = graphql(`
  mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {
    saveMemberProfile(userId: $userId, input: $input) {
      ...MemberProfileFields
    }
  }
`);

export const instrumentsDocument = graphql(`
  query Instruments($includeArchived: Boolean!) {
    instruments(includeArchived: $includeArchived) {
      id
      name
      section
      archived
    }
  }
`);

export const instrumentsPageDocument = graphql(`
  query InstrumentsPage($filter: InstrumentFilterInput, $page: PageInput) {
    instrumentsPage(filter: $filter, page: $page) {
      items {
        id
        name
        section
        archived
        memberCount
      }
      total
      page
      limit
      totalPages
    }
  }
`);

export const createInstrumentDocument = graphql(`
  mutation CreateInstrument($input: CreateInstrumentInput!) {
    createInstrument(input: $input) {
      id
      name
      section
      archived
    }
  }
`);

export const updateInstrumentDocument = graphql(`
  mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {
    updateInstrument(id: $id, input: $input) {
      id
      name
      section
      archived
    }
  }
`);

export const myBandDatesDocument = graphql(`
  query MyBandDates {
    myBandDates {
      birthDate
      joinedOn
    }
  }
`);

export const updateMyBandDatesDocument = graphql(`
  mutation UpdateMyBandDates($birthDate: String, $joinedOn: String) {
    updateMyBandDates(birthDate: $birthDate, joinedOn: $joinedOn) {
      birthDate
      joinedOn
    }
  }
`);

export const birthdaysDocument = graphql(`
  query Birthdays($month: Int) {
    birthdays(month: $month) {
      userId
      name
      warName
      rank
      day
      photoUrl
    }
  }
`);
