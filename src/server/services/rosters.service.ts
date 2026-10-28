import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  acknowledgeRosterDocument,
  keepOnRosterDocument,
  myAssignmentsDocument,
  myAssignmentsPageDocument,
  publishRosterDocument,
  rosterCandidatesDocument,
  rosterDocument,
  saveRosterDocument,
  swapRequestsDocument,
} from "@/server/graphql/operations/rosters.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  AckAnswer,
  AckStatus,
  AssignmentInput,
  MyAssignment,
  MyAssignmentCounts,
  MyAssignmentTab,
  Roster,
  SwapRequest,
  RosterCandidate,
} from "@/shared/contracts/rosters";

export const rostersService = {
  async get(token: string, eventId: string): Promise<Roster | null> {
    const { eventRoster } = await backendGraphql(rosterDocument, {
      token,
      variables: { eventId },
    });
    return eventRoster;
  },

  async candidates(token: string, eventId: string): Promise<RosterCandidate[]> {
    const { rosterCandidates } = await backendGraphql(
      rosterCandidatesDocument,
      { token, variables: { eventId } },
    );
    return rosterCandidates;
  },

  /** acknowledged: true only "ciente", false the rest, omitted all. */
  async mine(token: string, acknowledged?: boolean): Promise<MyAssignment[]> {
    const { myAssignments } = await backendGraphql(myAssignmentsDocument, {
      token,
      variables: { acknowledged: acknowledged ?? null },
    });
    return myAssignments;
  },

  /** "Minhas escalas": one tab's page and the count of every tab. */
  async minePage(
    token: string,
    query: { tab: MyAssignmentTab; page: number; limit: number },
  ): Promise<{
    page: Paginated<MyAssignment>;
    counts: MyAssignmentCounts;
  }> {
    const { myAssignmentsPage, myAssignmentCounts } = await backendGraphql(
      myAssignmentsPageDocument,
      {
        token,
        variables: {
          tab: query.tab,
          page: { page: query.page, limit: query.limit },
        },
      },
    );
    return { page: myAssignmentsPage, counts: myAssignmentCounts };
  },

  /** Open swap requests of upcoming events (managers). */
  async swapRequests(
    token: string,
    query: { page: number; limit: number },
  ): Promise<Paginated<SwapRequest>> {
    const { swapRequests } = await backendGraphql(swapRequestsDocument, {
      token,
      variables: { page: query },
    });
    return swapRequests;
  },

  /** Doesn't accept the swap: the person stays and answers again. */
  async keepOnRoster(
    token: string,
    eventId: string,
    userId: string,
    note: string | null,
  ): Promise<void> {
    await backendGraphql(keepOnRosterDocument, {
      token,
      variables: { eventId, userId, note },
    });
  },

  async save(
    token: string,
    eventId: string,
    assignments: AssignmentInput[],
  ): Promise<Roster> {
    const { saveRoster } = await backendGraphql(saveRosterDocument, {
      token,
      variables: { eventId, input: { assignments } },
    });
    return saveRoster;
  },

  async publish(token: string, eventId: string): Promise<Roster> {
    const { publishRoster } = await backendGraphql(publishRosterDocument, {
      token,
      variables: { eventId },
    });
    return publishRoster;
  },

  async acknowledge(
    token: string,
    eventId: string,
    answer: AckAnswer,
    note: string | null,
  ): Promise<{ ackStatus: AckStatus; ackNote: string | null }> {
    const { acknowledgeRoster } = await backendGraphql(
      acknowledgeRosterDocument,
      { token, variables: { eventId, answer, note } },
    );
    return acknowledgeRoster;
  },
};
