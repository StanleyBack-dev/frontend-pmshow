import { graphql } from "@/server/graphql/generated";

export const eventFieldsFragment = graphql(`
  fragment EventFields on Event {
    id
    title
    type
    status
    callTime
    startsAt
    endsAt
    venueId
    uniform
    requester
    documentRef
    notes
    cancellationReason
    venue {
      ...VenueFields
    }
  }
`);

export const venueFieldsFragment = graphql(`
  fragment VenueFields on Venue {
    id
    name
    zipCode
    street
    number
    complement
    district
    city
    state
    fullAddress
    mapsUrl
    notes
    archived
  }
`);

export const eventsPageDocument = graphql(`
  query EventsPage($filter: EventPageFilterInput, $page: PageInput) {
    eventsPage(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        ...EventFields
        setlistCount
        rosterSummary {
          status
          assignments
        }
      }
    }
  }
`);

export const venuesPageDocument = graphql(`
  query VenuesPage($filter: VenueFilterInput, $page: PageInput) {
    venuesPage(filter: $filter, page: $page) {
      total
      page
      limit
      totalPages
      items {
        ...VenueFields
      }
    }
  }
`);

export const zipCodeAddressDocument = graphql(`
  query ZipCodeAddress($zipCode: String!) {
    zipCodeAddress(zipCode: $zipCode) {
      zipCode
      street
      district
      city
      state
    }
  }
`);

export const eventsDocument = graphql(`
  query Events($filter: EventFilterInput) {
    events(filter: $filter) {
      ...EventFields
      myAssignment {
        functionName
        instrumentName
      }
    }
  }
`);

export const upcomingEventsDocument = graphql(`
  query UpcomingEvents($limit: Int!) {
    upcomingEvents(limit: $limit) {
      ...EventFields
    }
  }
`);

export const eventDocument = graphql(`
  query Event($id: ID!) {
    event(id: $id) {
      ...EventFields
      setlist {
        position
        songId
        notes
        song {
          id
          title
          musicalKey
          durationSeconds
          lyrics
          archivedAt
          media {
            id
            kind
            title
          }
        }
      }
    }
  }
`);

export const createEventDocument = graphql(`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      ...EventFields
    }
  }
`);

export const updateEventDocument = graphql(`
  mutation UpdateEvent($id: ID!, $input: EventInput!) {
    updateEvent(id: $id, input: $input) {
      ...EventFields
    }
  }
`);

export const changeEventStatusDocument = graphql(`
  mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {
    changeEventStatus(id: $id, status: $status, reason: $reason) {
      ...EventFields
    }
  }
`);

export const setEventSetlistDocument = graphql(`
  mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {
    setEventSetlist(id: $id, input: $input) {
      position
      songId
    }
  }
`);

export const venuesDocument = graphql(`
  query Venues($includeArchived: Boolean!) {
    venues(includeArchived: $includeArchived) {
      ...VenueFields
    }
  }
`);

export const createVenueDocument = graphql(`
  mutation CreateVenue($input: VenueInput!) {
    createVenue(input: $input) {
      ...VenueFields
    }
  }
`);

export const updateVenueDocument = graphql(`
  mutation UpdateVenue($id: ID!, $input: VenueInput!) {
    updateVenue(id: $id, input: $input) {
      ...VenueFields
    }
  }
`);
