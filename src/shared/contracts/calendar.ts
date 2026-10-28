/** The person's agenda link (iCal), ready for the calendar apps. */
export type CalendarFeedLinks = {
  createdAt: string;
  /** https address (Google Calendar "from URL", Outlook). */
  https: string;
  /** webcal:// opens the subscription on the iPhone / Mac. */
  webcal: string;
  /** Opens Google Calendar with the subscription filled in. */
  google: string;
};
