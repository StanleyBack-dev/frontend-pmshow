import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  acknowledgeRosterDocument,
  myAssignmentsDocument,
  publishRosterDocument,
  rosterCandidatesDocument,
  rosterDocument,
  saveRosterDocument,
} from "@/server/graphql/operations/rosters.operations";
import type {
  AckAnswer,
  AckStatus,
  AssignmentInput,
  MyAssignment,
  Roster,
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

  async mine(token: string): Promise<MyAssignment[]> {
    const { myAssignments } = await backendGraphql(myAssignmentsDocument, {
      token,
    });
    return myAssignments;
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
