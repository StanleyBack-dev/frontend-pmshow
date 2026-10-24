/** Manager's overview (home page). */
export type BandDashboard = {
  activeMembers: number;
  awayMembers: number;
  /** Planned/confirmed events in the next 30 days. */
  upcomingEvents: number;
  /** …of which have no published roster yet. */
  eventsWithoutRoster: number;
  pendingAcks: number;
  swapRequests: number;
  pendingAbsences: number;
  absentToday: number;
  /** Notifications the API gave up sending. */
  failedNotifications: number;
};
