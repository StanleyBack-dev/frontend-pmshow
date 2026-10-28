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
  /** "Full name (war name)" of who approved / refused. */
  reviewedByName: string | null;
  cancelledAt: string | null;
  cancelledByName: string | null;
  /** Registered by a manager for the member (already approved). */
  registered: boolean;
  createdAt: string;
  /** Images or PDFs sent with the request (view/download by link). */
  attachments: AbsenceAttachment[];
};

export type AbsenceAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

/** Where the browser sends one attachment (a signed form). */
export type AttachmentUpload = {
  storageKey: string;
  upload: { url: string; fields: Record<string, string> };
};

export type AbsenceInput = {
  type: AbsenceType;
  startsOn: string;
  endsOn: string;
  reason: string | null;
  /** Files already sent to storage (own requests only). */
  attachments?: { storageKey: string; fileName: string }[];
};
