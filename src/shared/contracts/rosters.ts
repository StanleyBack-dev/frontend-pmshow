import type {
  AbsenceType,
  AckAnswer,
  AckStatus,
  AssignmentRole,
  CandidateBlocker,
  EventStatus,
  EventType,
  MemberStatus,
  Rank,
  RosterStatus,
  Section,
} from "@/shared/graphql/schema-enums";

export type {
  AckAnswer,
  AckStatus,
  AssignmentRole,
  CandidateBlocker,
  RosterStatus,
};

export type Assignment = {
  userId: string;
  role: AssignmentRole;
  instrumentId: string | null;
  instrumentName: string | null;
  notes: string | null;
  overrideReason: string | null;
  ackStatus: AckStatus;
  ackNote: string | null;
  ackAt: string | null;
  /** null when the account was disabled. */
  person: {
    name: string;
    warName: string;
    rank: Rank;
    section: Section;
  } | null;
};

export type Roster = {
  eventId: string;
  status: RosterStatus;
  version: number;
  publishedAt: string | null;
  uncoveredSections: Section[];
  assignments: Assignment[];
};

export type RosterCandidate = {
  userId: string;
  name: string;
  warName: string;
  rank: Rank;
  section: Section;
  memberStatus: MemberStatus;
  instruments: { instrumentId: string; name: string; primary: boolean }[];
  blocker: CandidateBlocker | null;
  absence: { type: AbsenceType; startsOn: string; endsOn: string } | null;
  busyWith: { eventId: string; title: string }[];
};

export type MyAssignment = {
  eventId: string;
  role: AssignmentRole;
  instrumentId: string | null;
  instrumentName: string | null;
  ackStatus: AckStatus;
  ackNote: string | null;
  event: {
    id: string;
    title: string;
    type: EventType;
    status: EventStatus;
    callTime: string | null;
    startsAt: string;
    endsAt: string | null;
    venue: { id: string; name: string } | null;
  } | null;
};

export type AssignmentInput = {
  userId: string;
  role: AssignmentRole;
  instrumentId: string | null;
  notes: string | null;
  overrideReason: string | null;
};
