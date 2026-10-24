import type { BroadcastAudience } from "@/shared/contracts/broadcasts";

export const AUDIENCE_LABELS: Record<BroadcastAudience, string> = {
  TODOS: "Toda a banda",
  NAIPE: "Um naipe",
  ESCALA_EVENTO: "Escalados de um evento",
};

export const AUDIENCES = Object.keys(AUDIENCE_LABELS) as BroadcastAudience[];
