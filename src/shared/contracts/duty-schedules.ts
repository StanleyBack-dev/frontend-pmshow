import type {
  DutyAudienceKind,
  DutyScheduleStatus,
  EventStatus,
  EventUniform,
  Rank,
  Section,
} from "@/shared/graphql/schema-enums";

export type { DutyAudienceKind, DutyScheduleStatus };

/** An expediente launched for a week or a month. */
export type DutySchedule = {
  id: string;
  title: string;
  /** First and last working day (YYYY-MM-DD). */
  startsOn: string;
  endsOn: string;
  venueId: string;
  uniform: EventUniform;
  notes: string | null;
  audienceKind: DutyAudienceKind;
  sections: Section[];
  status: DutyScheduleStatus;
  cancellationReason: string | null;
  dayCount: number;
  memberCount: number;
  createdAt: string;
};

export type DutyScheduleDetail = DutySchedule & {
  venue: { id: string; name: string; fullAddress: string } | null;
  /** One event per working day. */
  days: {
    id: string;
    status: EventStatus;
    startsAt: string;
    endsAt: string | null;
  }[];
  members: {
    userId: string;
    name: string;
    profile: { warName: string; rank: Rank; section: Section } | null;
  }[];
};

export type DutyScheduleInput = {
  title: string | null;
  venueId: string;
  uniform: EventUniform;
  notes: string | null;
  /** Entrada and saída of each working day (ISO instants). */
  days: { startsAt: string; endsAt: string }[];
  audience: {
    kind: DutyAudienceKind;
    sections: Section[];
    userIds: string[];
  };
};
