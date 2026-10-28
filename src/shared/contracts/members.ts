import type {
  MemberStatus,
  Rank,
  Section,
} from "@/shared/graphql/schema-enums";

export type { MemberStatus, Rank, Section };

export type Instrument = {
  id: string;
  name: string;
  section: Section;
  archived: boolean;
};

/** A row of the instruments page. */
export type InstrumentListItem = Instrument & {
  /** Members whose band profile lists it. */
  memberCount: number;
};

export type MemberProfile = {
  userId: string;
  warName: string;
  rank: Rank;
  registration: string | null;
  phone: string | null;
  section: Section;
  status: MemberStatus;
  notes: string | null;
  updatedAt: string;
  instruments: { instrumentId: string; name: string; primary: boolean }[];
  functions: { functionId: string; name: string }[];
};

export type RosterEntry = {
  userId: string;
  name: string;
  username: string;
  active: boolean;
  /** Short-lived link to the profile photo (null: none). */
  photoUrl: string | null;
  profile: MemberProfile | null;
};

export type MemberProfileInput = {
  warName: string;
  rank: Rank;
  registration: string | null;
  phone: string | null;
  section: Section;
  status: MemberStatus;
  notes: string | null;
  instruments: { instrumentId: string; primary: boolean }[];
  functionIds: string[];
};

/** A function in the band (regente, motorista, técnico de som…). */
export type BandFunction = {
  id: string;
  name: string;
  archived: boolean;
};

/** A row of the functions page. */
export type BandFunctionListItem = BandFunction & {
  /** Members whose band profile lists it. */
  memberCount: number;
};
