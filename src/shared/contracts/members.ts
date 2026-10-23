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
};

export type RosterEntry = {
  userId: string;
  name: string;
  username: string;
  active: boolean;
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
};
