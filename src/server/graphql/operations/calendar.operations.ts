import { graphql } from "@/server/graphql/generated";

export const myCalendarFeedDocument = graphql(`
  query MyCalendarFeed {
    myCalendarFeed {
      token
      createdAt
    }
  }
`);

export const renewCalendarFeedDocument = graphql(`
  mutation RenewCalendarFeed {
    renewCalendarFeed {
      token
      createdAt
    }
  }
`);

export const removeCalendarFeedDocument = graphql(`
  mutation RemoveCalendarFeed {
    removeCalendarFeed
  }
`);

export const calendarFeedIcsDocument = graphql(`
  query CalendarFeedIcs($token: String!) {
    calendarFeedIcs(token: $token)
  }
`);
