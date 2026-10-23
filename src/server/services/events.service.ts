import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  changeEventStatusDocument,
  createEventDocument,
  createVenueDocument,
  eventDocument,
  eventsDocument,
  setEventSetlistDocument,
  upcomingEventsDocument,
  updateEventDocument,
  updateVenueDocument,
  venuesDocument,
} from "@/server/graphql/operations/events.operations";
import type {
  BandEvent,
  EventInput,
  EventStatus,
  EventWithSetlist,
  Venue,
  VenueInput,
} from "@/shared/contracts/events";

export const eventsService = {
  async list(
    token: string,
    range: { from: string; to: string },
  ): Promise<BandEvent[]> {
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
