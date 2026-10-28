import type {
  SupportCategory,
  SupportStatus,
} from "@/shared/graphql/schema-enums";

export type { SupportCategory, SupportStatus };

export type SupportRequest = {
  id: string;
  /** Sequential number people quote ("#000042"). */
  protocol: number;
  userId: string;
  userName: string;
  warName: string | null;
  category: SupportCategory;
  subject: string;
  message: string;
  status: SupportStatus;
  reply: string | null;
  repliedAt: string | null;
  repliedByName: string | null;
  finalizedAt: string | null;
  finalizedByName: string | null;
  createdAt: string;
};

/** Today's limit of requests. */
export type SupportQuota = {
  limit: number;
  sentToday: number;
  remaining: number;
  /** When a new request is possible (null: now). */
  nextAllowedAt: string | null;
};

export type SupportRequestInput = {
  category: SupportCategory;
  subject: string;
  message: string;
};
