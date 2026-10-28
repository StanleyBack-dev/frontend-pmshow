import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  changeEventStatusDocument,
  createEventDocument,
  createVenueDocument,
  eventDocument,
  eventsDocument,
  eventsPageDocument,
  setEventSetlistDocument,
  upcomingEventsDocument,
  updateEventDocument,
  updateVenueDocument,
  venuesDocument,
  venuesPageDocument,
  zipCodeAddressDocument,
} from "@/server/graphql/operations/events.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  AgendaEvent,
  BandEvent,
  EventInput,
  EventListItem,
  EventPeriod,
  EventStatus,
  EventType,
  EventWithSetlist,
  Venue,
  VenueInput,
  ZipCodeAddress,
} from "@/shared/contracts/events";

export type EventPageQuery = {
  search?: string;
  type?: EventType;
  status?: EventStatus;
  period?: EventPeriod;
  page: number;
  limit: number;
};

export const eventsService = {
  async page(
    token: string,
    query: EventPageQuery,
  ): Promise<Paginated<EventListItem>> {
    const { eventsPage } = await backendGraphql(eventsPageDocument, {
      token,
      variables: {
        filter: {
          search: query.search || undefined,
          type: query.type,
          statuses: query.status ? [query.status] : undefined,
          period: query.period,
        },
        page: { page: query.page, limit: query.limit },
      },
    });
    return eventsPage;
  },

  /** The agenda: events of a period, with my line on each roster. */
  async list(
    token: string,
    range: { from: string; to: string },
  ): Promise<AgendaEvent[]> {
    const { events } = await backendGraphql(eventsDocument, {
      token,
      variables: { filter: range },
    });
    return events;
  },

  async upcoming(token: string, limit: number): Promise<BandEvent[]> {
    const { upcomingEvents } = await backendGraphql(upcomingEventsDocument, {
      token,
      variables: { limit },
    });
    return upcomingEvents;
  },

  async get(token: string, id: string): Promise<EventWithSetlist> {
    const { event } = await backendGraphql(eventDocument, {
      token,
      variables: { id },
    });
    return event;
  },

  async create(token: string, input: EventInput): Promise<BandEvent> {
    const { createEvent } = await backendGraphql(createEventDocument, {
      token,
      variables: { input },
    });
    return createEvent;
  },

  async update(
    token: string,
    id: string,
    input: EventInput,
  ): Promise<BandEvent> {
    const { updateEvent } = await backendGraphql(updateEventDocument, {
      token,
      variables: { id, input },
    });
    return updateEvent;
  },

  async changeStatus(
    token: string,
    id: string,
    status: EventStatus,
    reason: string | null,
  ): Promise<BandEvent> {
    const { changeEventStatus } = await backendGraphql(
      changeEventStatusDocument,
      { token, variables: { id, status, reason } },
    );
    return changeEventStatus;
  },

  async setSetlist(
    token: string,
    id: string,
    items: { songId: string; notes: string | null }[],
  ): Promise<void> {
    await backendGraphql(setEventSetlistDocument, {
      token,
      variables: { id, input: { items } },
    });
  },

  async venuesPage(
    token: string,
    query: { search?: string; archived: boolean; page: number; limit: number },
  ): Promise<Paginated<Venue>> {
    const { venuesPage } = await backendGraphql(venuesPageDocument, {
      token,
      variables: {
        filter: { search: query.search || undefined, archived: query.archived },
        page: { page: query.page, limit: query.limit },
      },
    });
    return venuesPage;
  },

  async zipCodeAddress(
    token: string,
    zipCode: string,
  ): Promise<ZipCodeAddress | null> {
    const { zipCodeAddress } = await backendGraphql(zipCodeAddressDocument, {
      token,
      variables: { zipCode },
    });
    return zipCodeAddress ?? null;
  },

  async venues(token: string, includeArchived = false): Promise<Venue[]> {
    const { venues } = await backendGraphql(venuesDocument, {
      token,
      variables: { includeArchived },
    });
    return venues;
  },

  async createVenue(token: string, input: VenueInput): Promise<Venue> {
    const { createVenue } = await backendGraphql(createVenueDocument, {
      token,
      variables: { input },
    });
    return createVenue;
  },

  async updateVenue(
    token: string,
    id: string,
    input: VenueInput,
  ): Promise<Venue> {
    const { updateVenue } = await backendGraphql(updateVenueDocument, {
      token,
      variables: { id, input },
    });
    return updateVenue;
  },
};
