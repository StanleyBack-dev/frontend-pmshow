import { graphql } from "@/server/graphql/generated";

export const bandDashboardDocument = graphql(`
  query BandDashboard {
    bandDashboard {
      activeMembers
      awayMembers
      upcomingEvents
      eventsWithoutRoster
      pendingAcks
      swapRequests
      pendingAbsences
      absentToday
      failedNotifications
    }
  }
`);
