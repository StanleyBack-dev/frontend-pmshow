import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  absencesDocument,
  cancelAbsenceDocument,
  myAbsencesDocument,
  registerAbsenceDocument,
  absenceAttachmentUrlDocument,
  requestAbsenceAttachmentUploadsDocument,
  requestAbsenceDocument,
  reviewAbsenceDocument,
} from "@/server/graphql/operations/absences.operations";
import type {
  Absence,
  AbsenceInput,
  AbsenceStatus,
  AttachmentUpload,
} from "@/shared/contracts/absences";

export const absencesService = {
  async mine(token: string): Promise<Absence[]> {
    const { myAbsences } = await backendGraphql(myAbsencesDocument, { token });
    return myAbsences;
  },

  async list(
    token: string,
    filter: { statuses?: AbsenceStatus[]; from?: string; to?: string },
  ): Promise<Absence[]> {
    const { absences } = await backendGraphql(absencesDocument, {
      token,
      variables: { filter },
    });
    return absences;
  },

  async requestAttachmentUploads(
    token: string,
    files: { fileName: string; mimeType: string; sizeBytes: number }[],
  ): Promise<AttachmentUpload[]> {
    const { requestAbsenceAttachmentUploads } = await backendGraphql(
      requestAbsenceAttachmentUploadsDocument,
      { token, variables: { files } },
    );
    return requestAbsenceAttachmentUploads.map((item) => ({
      storageKey: item.storageKey,
      upload: {
        url: item.upload.url,
        fields: item.upload.fields as Record<string, string>,
      },
    }));
  },

  async attachmentUrl(
    token: string,
    id: string,
    download: boolean,
  ): Promise<string> {
    const { absenceAttachmentUrl } = await backendGraphql(
      absenceAttachmentUrlDocument,
      { token, variables: { id, download } },
    );
    return absenceAttachmentUrl;
  },

  async request(token: string, input: AbsenceInput): Promise<Absence> {
    const { requestAbsence } = await backendGraphql(requestAbsenceDocument, {
      token,
      variables: { input },
    });
    return requestAbsence;
  },

  async register(
    token: string,
    userId: string,
    input: AbsenceInput,
  ): Promise<Absence> {
    const { registerAbsence } = await backendGraphql(registerAbsenceDocument, {
      token,
      variables: { userId, input },
    });
    return registerAbsence;
  },

  async review(
    token: string,
    id: string,
    approve: boolean,
    note: string | null,
  ): Promise<Absence> {
    const { reviewAbsence } = await backendGraphql(reviewAbsenceDocument, {
      token,
      variables: { id, approve, note },
    });
    return reviewAbsence;
  },

  async cancel(token: string, id: string): Promise<Absence> {
    const { cancelAbsence } = await backendGraphql(cancelAbsenceDocument, {
      token,
      variables: { id },
    });
    return cancelAbsence;
  },
};
