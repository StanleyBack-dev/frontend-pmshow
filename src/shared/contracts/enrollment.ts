import type { TemporaryAccess } from "@/shared/contracts/api";
import type { Rank } from "@/shared/contracts/members";
import type { EnrollmentStatus } from "@/shared/graphql/schema-enums";

export type { EnrollmentStatus };

/** Code shared with a cohort of musicians (one code, many answers). */
export type EnrollmentInvite = {
  id: string;
  code: string;
  label: string;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  requestCount: number;
};

export type EnrollmentInstrumentChoice = {
  instrumentId: string;
  primary: boolean;
};

/** Public form data; also what the manager corrects before approving. */
export type EnrollmentData = {
  fullName: string;
  email: string;
  phone: string;
  military: boolean;
  /** RG militar (5 digits). */
  militaryId: string | null;
  rank: Rank | null;
  warName: string;
  instruments: EnrollmentInstrumentChoice[];
};

export type EnrollmentRequest = Omit<EnrollmentData, "rank"> & {
  id: string;
  status: EnrollmentStatus;
  rank: Rank;
  createdAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  userId: string | null;
  /** Short-lived link to the profile photo sent with the sign-up. */
  photoUrl: string | null;
};

export type EnrollmentApproval = {
  request: EnrollmentRequest;
  access: TemporaryAccess;
};

export type EnrollmentInstrument = { id: string; name: string };
