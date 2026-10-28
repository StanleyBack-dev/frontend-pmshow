import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import { BackendError } from "@/server/http/backend-error";
import {
  approveEnrollmentRequestDocument,
  createEnrollmentInviteDocument,
  enrollmentInstrumentsDocument,
  enrollmentInvitesDocument,
  enrollmentRequestsDocument,
  rejectEnrollmentRequestDocument,
  revokeEnrollmentInviteDocument,
  submitEnrollmentDocument,
  verifyEnrollmentCodeDocument,
} from "@/server/graphql/operations/enrollment.operations";
import type { Paginated, UserGroup } from "@/shared/contracts/api";
import type {
  EnrollmentApproval,
  EnrollmentData,
  EnrollmentInstrument,
  EnrollmentInvite,
  EnrollmentRequest,
  EnrollmentStatus,
} from "@/shared/contracts/enrollment";

export type EnrollmentRequestQuery = {
  status?: EnrollmentStatus;
  search?: string;
  page: number;
  limit: number;
};

/** The form cookie is gone (60 min passed or the form was already sent). */
export const enrollmentFormExpired = () =>
  new BackendError(
    410,
    "ENROLLMENT_FORM_EXPIRED",
    "O tempo para preencher o formulário acabou. Digite o código de novo.",
  );

export const enrollmentService = {
  // === public (no session) ===

  async verifyCode(code: string): Promise<string> {
    const { verifyEnrollmentCode } = await backendGraphql(
      verifyEnrollmentCodeDocument,
      { variables: { code } },
    );
    return verifyEnrollmentCode;
  },

  async instruments(formToken: string): Promise<EnrollmentInstrument[]> {
    const { enrollmentInstruments } = await backendGraphql(
      enrollmentInstrumentsDocument,
      { variables: { formToken } },
    );
    return enrollmentInstruments;
  },

  async submit(
    formToken: string,
    data: EnrollmentData,
    consent: boolean,
    photo: string | null,
  ): Promise<void> {
    await backendGraphql(submitEnrollmentDocument, {
      variables: { input: { formToken, data, consent, photo } },
    });
  },

  // === manager ===

  async invites(token: string): Promise<EnrollmentInvite[]> {
    const { enrollmentInvites } = await backendGraphql(
      enrollmentInvitesDocument,
      { token },
    );
    return enrollmentInvites;
  },

  async createInvite(
    token: string,
    input: { label: string; validDays: number },
  ): Promise<EnrollmentInvite> {
    const { createEnrollmentInvite } = await backendGraphql(
      createEnrollmentInviteDocument,
      { token, variables: { input } },
    );
    return createEnrollmentInvite;
  },

  async revokeInvite(token: string, id: string): Promise<EnrollmentInvite> {
    const { revokeEnrollmentInvite } = await backendGraphql(
      revokeEnrollmentInviteDocument,
      { token, variables: { id } },
    );
    return revokeEnrollmentInvite;
  },

  async requests(
    token: string,
    query: EnrollmentRequestQuery,
  ): Promise<{ page: Paginated<EnrollmentRequest>; pending: number }> {
    const { enrollmentRequests, pendingEnrollmentCount } = await backendGraphql(
      enrollmentRequestsDocument,
      {
        token,
        variables: {
          filter: {
            status: query.status,
            search: query.search || undefined,
          },
          page: { page: query.page, limit: query.limit },
        },
      },
    );
    return { page: enrollmentRequests, pending: pendingEnrollmentCount };
  },

  async approve(
    token: string,
    id: string,
    data: EnrollmentData,
    group: UserGroup,
  ): Promise<EnrollmentApproval> {
    const { approveEnrollmentRequest } = await backendGraphql(
      approveEnrollmentRequestDocument,
      { token, variables: { id, data, group } },
    );
    return approveEnrollmentRequest;
  },

  async reject(
    token: string,
    id: string,
    reason: string,
  ): Promise<EnrollmentRequest> {
    const { rejectEnrollmentRequest } = await backendGraphql(
      rejectEnrollmentRequestDocument,
      { token, variables: { id, reason } },
    );
    return rejectEnrollmentRequest;
  },
};
