import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  broadcastsDocument,
  sendBroadcastDocument,
} from "@/server/graphql/operations/broadcasts.operations";
import type { Broadcast, BroadcastInput } from "@/shared/contracts/broadcasts";

export const broadcastsService = {
  async list(token: string): Promise<Broadcast[]> {
    const { broadcasts } = await backendGraphql(broadcastsDocument, { token });
    return broadcasts;
  },

  async send(token: string, input: BroadcastInput): Promise<Broadcast> {
    const { sendBroadcast } = await backendGraphql(sendBroadcastDocument, {
      token,
      variables: { input },
    });
    return sendBroadcast;
  },
};
