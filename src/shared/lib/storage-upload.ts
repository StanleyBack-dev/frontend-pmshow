import { ApiClientError } from "@/shared/lib/api-client";

/**
 * Sends the file straight to storage with the signed form (never through
 * our servers). XHR rather than fetch, for upload progress.
 */
export function uploadToStorage(
  ticket: { upload: { url: string; fields: Record<string, string> } },
  file: File,
  onProgress: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(ticket.upload.fields)) {
      form.append(key, value);
    }
    form.append("file", file); // must be the last field

    const request = new XMLHttpRequest();
    request.open("POST", ticket.upload.url);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(
            new ApiClientError(
              request.status,
              "STORAGE_UPLOAD_FAILED",
              "O armazenamento recusou o arquivo. Tente novamente.",
            ),
          );
    request.onerror = () =>
      reject(
        new ApiClientError(
          0,
          "STORAGE_UNREACHABLE",
          "Falha de conexão ao enviar o arquivo.",
        ),
      );
    request.send(form);
  });
}
