import type {
  AbsenceType,
  AckAnswer,
  AckStatus,
  CandidateBlocker,
  EventStatus,
  EventType,
  MemberStatus,
  MyAssignmentTab,
  Rank,
  RosterStatus,
  Section,
} from "@/shared/graphql/schema-enums";

export type { AckAnswer, AckStatus, CandidateBlocker, RosterStatus };

export type Assignment = {
  userId: string;
  /** Function in the band (regente, motorista…); null = musician. */
  functionId: string | null;
  functionName: string | null;
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
    /** Short-lived link to the profile photo (null: none). */
    photoUrl: string | null;
    rank: Rank;
    registration: string | null;
    /** Digits only (area code + number). */
    phone: string | null;
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
  /** Short-lived link to the profile photo (null: none). */
  photoUrl: string | null;
  rank: Rank;
  registration: string | null;
  /** Digits only (area code + number). */
  phone: string | null;
  section: Section;
  memberStatus: MemberStatus;
  instruments: { instrumentId: string; name: string; primary: boolean }[];
  functions: { functionId: string; name: string }[];
  blocker: CandidateBlocker | null;
  absence: { type: AbsenceType; startsOn: string; endsOn: string } | null;
  busyWith: { eventId: string; title: string }[];
};

export type MyAssignment = {
  eventId: string;
  functionId: string | null;
  functionName: string | null;
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

/** An open swap request (managers' list): who, where and why. */
export type SwapRequest = MyAssignment & {
  userId: string;
  ackAt: string | null;
  person: {
    name: string;
    warName: string;
    /** Short-lived link to the profile photo (null: none). */
    photoUrl: string | null;
    rank: Rank;
    section: Section;
  } | null;
};

export type AssignmentInput = {
  userId: string;
  functionId: string | null;
  instrumentId: string | null;
  notes: string | null;
  overrideReason: string | null;
};

/** Tabs of "Minhas escalas": events by answer, and working days. */
export type { MyAssignmentTab };

/** How many lines each tab of "Minhas escalas" has. */
export type MyAssignmentCounts = {
  pending: number;
  acknowledged: number;
  duty: number;
};
