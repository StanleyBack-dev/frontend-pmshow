import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  calendarFeedIcsDocument,
  myCalendarFeedDocument,
  removeCalendarFeedDocument,
  renewCalendarFeedDocument,
} from "@/server/graphql/operations/calendar.operations";
import type { CalendarFeedLinks } from "@/shared/contracts/calendar";
import { siteUrl } from "@/shared/lib/site";

export function feedLinks(feed: {
  token: string;
  createdAt: string;
}): CalendarFeedLinks {
  const https = `${siteUrl()}/api/public/agenda/${feed.token}.ics`;
  const webcal = https.replace(/^https?:/, "webcal:");
  return {
    createdAt: feed.createdAt,
    https,
    webcal,
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`,
  };
}

export const calendarService = {
  async mine(token: string): Promise<CalendarFeedLinks | null> {
    const { myCalendarFeed } = await backendGraphql(myCalendarFeedDocument, {
      token,
    });
    return myCalendarFeed ? feedLinks(myCalendarFeed) : null;
  },

  async renew(token: string): Promise<CalendarFeedLinks> {
    const { renewCalendarFeed } = await backendGraphql(
      renewCalendarFeedDocument,
      { token },
    );
    return feedLinks(renewCalendarFeed);
  },

  async remove(token: string): Promise<void> {
    await backendGraphql(removeCalendarFeedDocument, { token });
  },

  /** The calendar of a link (public: the token is the key). */
  async ics(feedToken: string): Promise<string | null> {
    const { calendarFeedIcs } = await backendGraphql(calendarFeedIcsDocument, {
      variables: { token: feedToken },
    });
    return calendarFeedIcs ?? null;
  },
};
