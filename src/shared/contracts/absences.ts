import type { AbsenceStatus, AbsenceType } from "@/shared/graphql/schema-enums";

export type { AbsenceStatus, AbsenceType };

export type Absence = {
  id: string;
  userId: string;
  userName: string;
  warName: string | null;
  type: AbsenceType;
  /** YYYY-MM-DD, both inclusive. */
  startsOn: string;
  endsOn: string;
  reason: string | null;
  status: AbsenceStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type AbsenceInput = {
  type: AbsenceType;
  startsOn: string;
  endsOn: string;
  reason: string | null;
};
