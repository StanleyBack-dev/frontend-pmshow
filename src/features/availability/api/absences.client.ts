import { apiRequest } from "@/shared/lib/api-client";
import type {
  Absence,
  AbsenceInput,
  AttachmentUpload,
} from "@/shared/contracts/absences";

const post = (body?: unknown): RequestInit => ({
  method: "POST",
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const absencesClient = {
  /** Signed forms to send the files of a request straight to storage. */
  attachmentUploads: (files: File[]) =>
    apiRequest<AttachmentUpload[]>(
      "/absences/attachments",
      post({
        files: files.map((file) => ({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        })),
      }),
    ),

  request: (input: AbsenceInput) =>
    apiRequest<Absence>("/absences", post(input)),

  register: (userId: string, input: AbsenceInput) =>
    apiRequest<Absence>("/absences/register", post({ userId, ...input })),

  review: (id: string, approve: boolean, note: string | null) =>
    apiRequest<Absence>(`/absences/${id}/review`, post({ approve, note })),

  cancel: (id: string) => apiRequest<Absence>(`/absences/${id}/cancel`, post()),
};

/** The short-lived storage link of an attachment (opens or saves it). */
export const attachmentUrl = (id: string, download = false) =>
  apiRequest<{ url: string }>(
    `/absences/attachments/${id}?formato=json${download ? "&baixar=1" : ""}`,
  ).then((result) => result.url);
