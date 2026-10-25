import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  createInstrumentDocument,
  instrumentsDocument,
  memberProfileDocument,
  myMemberProfileDocument,
  rosterDocument,
  saveMemberProfileDocument,
  updateInstrumentDocument,
} from "@/server/graphql/operations/members.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  Instrument,
  MemberProfile,
  MemberProfileInput,
  MemberStatus,
  RosterEntry,
  Section,
} from "@/shared/contracts/members";

export type RosterQuery = {
  search?: string;
  section?: Section;
  status?: MemberStatus;
  instrumentId?: string;
  withProfile?: boolean;
  page: number;
  limit?: number;
};

export const membersService = {
  async roster(
    token: string,
    query: RosterQuery,
  ): Promise<Paginated<RosterEntry>> {
    const { roster } = await backendGraphql(rosterDocument, {
      token,
      variables: {
        filter: {
          search: query.search || undefined,
          section: query.section,
          status: query.status,
          instrumentId: query.instrumentId,
          withProfile: query.withProfile,
        },
        page: { page: query.page, limit: query.limit ?? 10 },
      },
    });
    return roster;
  },

  /** Everyone with a band profile (all pages; the band is small). */
  async bandMembers(token: string): Promise<RosterEntry[]> {
    const first = await membersService.roster(token, {
      withProfile: true,
      page: 1,
    });
    const rest = await Promise.all(
      Array.from({ length: first.totalPages - 1 }, (_, index) =>
        membersService.roster(token, { withProfile: true, page: index + 2 }),
      ),
    );
    return [first, ...rest].flatMap((page) => page.items);
  },

  async profile(token: string, userId: string): Promise<MemberProfile | null> {
    const { memberProfile } = await backendGraphql(memberProfileDocument, {
      token,
      variables: { userId },
    });
    return memberProfile ?? null;
  },

  async myProfile(token: string): Promise<MemberProfile | null> {
    const { myMemberProfile } = await backendGraphql(myMemberProfileDocument, {
      token,
    });
    return myMemberProfile ?? null;
  },

  async saveProfile(
    token: string,
    userId: string,
    input: MemberProfileInput,
  ): Promise<MemberProfile> {
    const { saveMemberProfile } = await backendGraphql(
      saveMemberProfileDocument,
      { token, variables: { userId, input } },
    );
    return saveMemberProfile;
  },

  async instruments(
    token: string,
    includeArchived = false,
  ): Promise<Instrument[]> {
    const { instruments } = await backendGraphql(instrumentsDocument, {
      token,
      variables: { includeArchived },
    });
    return instruments;
  },

  async createInstrument(
    token: string,
    input: { name: string; section: Section },
  ): Promise<Instrument> {
    const { createInstrument } = await backendGraphql(
      createInstrumentDocument,
      { token, variables: { input } },
    );
    return createInstrument;
  },

  async updateInstrument(
    token: string,
    id: string,
    input: { name?: string; section?: Section; archived?: boolean },
  ): Promise<Instrument> {
    const { updateInstrument } = await backendGraphql(
      updateInstrumentDocument,
      { token, variables: { id, input } },
    );
    return updateInstrument;
  },
};
