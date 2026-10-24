import type { BroadcastAudience, Section } from "@/shared/graphql/schema-enums";

export type { BroadcastAudience };

export type Broadcast = {
  id: string;
  title: string;
  body: string;
  audience: BroadcastAudience;
  section: Section | null;
  eventId: string | null;
  sendEmail: boolean;
  recipients: number;
  authorName: string | null;
  createdAt: string;
};

export type BroadcastInput = {
  title: string;
  body: string;
  audience: BroadcastAudience;
  section: Section | null;
  eventId: string | null;
  sendEmail: boolean;
};
