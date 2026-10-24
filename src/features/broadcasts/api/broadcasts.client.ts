import { apiRequest } from "@/shared/lib/api-client";
import type { Broadcast, BroadcastInput } from "@/shared/contracts/broadcasts";

export const broadcastsClient = {
  send: (input: BroadcastInput) =>
    apiRequest<Broadcast>("/broadcasts", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
