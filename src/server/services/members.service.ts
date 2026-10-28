import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  createInstrumentDocument,
  instrumentsDocument,
  instrumentsPageDocument,
  memberProfileDocument,
  myMemberProfileDocument,
  rosterDocument,
  birthdaysDocument,
  myBandDatesDocument,
  saveMemberProfileDocument,
  updateMyBandDatesDocument,
  updateInstrumentDocument,
} from "@/server/graphql/operations/members.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  BandDates,
  Birthday,
  Instrument,
  InstrumentListItem,
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
  functionId?: string;
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
          functionId: query.functionId,
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

  /** The month's birthdays (default: this month). */
  async birthdays(token: string, month?: number): Promise<Birthday[]> {
    const { birthdays } = await backendGraphql(birthdaysDocument, {
      token,
      variables: { month: month ?? null },
    });
    return birthdays;
  },

  /** The user's own birthday and band start date (any user). */
  async myDates(token: string): Promise<BandDates> {
    const { myBandDates } = await backendGraphql(myBandDatesDocument, {
      token,
    });
    return myBandDates;
  },

  /** The user's own birthday and band start date (both optional). */
  async saveMyDates(token: string, dates: BandDates): Promise<BandDates> {
    const { updateMyBandDates } = await backendGraphql(
      updateMyBandDatesDocument,
      { token, variables: dates },
    );
    return updateMyBandDates;
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

  async instrumentsPage(
    token: string,
    query: {
      search: string;
      section?: Section;
      archived: boolean;
      page: number;
      limit: number;
    },
  ): Promise<Paginated<InstrumentListItem>> {
    const { instrumentsPage } = await backendGraphql(instrumentsPageDocument, {
      token,
      variables: {
        filter: {
          search: query.search || undefined,
          section: query.section,
          archived: query.archived,
        },
        page: { page: query.page, limit: query.limit },
      },
    });
    return instrumentsPage;
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
