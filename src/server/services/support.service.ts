import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  finalizeSupportRequestDocument,
  replySupportRequestDocument,
  sendSupportRequestDocument,
  supportPageDocument,
  supportRequestsDocument,
} from "@/server/graphql/operations/support.operations";
import type { Paginated } from "@/shared/contracts/api";
import type {
  SupportQuota,
  SupportRequest,
  SupportRequestInput,
  SupportStatus,
} from "@/shared/contracts/support";

type PageQuery = { page: number; limit: number };

export const supportService = {
  /** The person's quota and their own requests (one page). */
  async mine(
    token: string,
    page: PageQuery,
  ): Promise<{ quota: SupportQuota; requests: Paginated<SupportRequest> }> {
    const { supportQuota, mySupportRequests } = await backendGraphql(
      supportPageDocument,
      { token, variables: { page } },
    );
    return { quota: supportQuota, requests: mySupportRequests };
  },

  /** Every request (administrators). */
  async all(
    token: string,
    query: PageQuery & { status: SupportStatus | null },
  ): Promise<Paginated<SupportRequest>> {
    const { supportRequests } = await backendGraphql(supportRequestsDocument, {
      token,
      variables: {
        status: query.status,
        page: { page: query.page, limit: query.limit },
      },
    });
    return supportRequests;
  },

  async send(
    token: string,
    input: SupportRequestInput,
  ): Promise<SupportRequest> {
    const { sendSupportRequest } = await backendGraphql(
      sendSupportRequestDocument,
      { token, variables: { input } },
    );
    return sendSupportRequest;
  },

  async reply(
    token: string,
    id: string,
    reply: string,
  ): Promise<SupportRequest> {
    const { replySupportRequest } = await backendGraphql(
      replySupportRequestDocument,
      { token, variables: { id, reply } },
    );
    return replySupportRequest;
  },

  async finalize(token: string, id: string): Promise<SupportRequest> {
    const { finalizeSupportRequest } = await backendGraphql(
      finalizeSupportRequestDocument,
      { token, variables: { id } },
    );
    return finalizeSupportRequest;
  },
};
