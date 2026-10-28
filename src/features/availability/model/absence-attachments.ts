// Same limits as the API (absence-attachment.ts there): images or PDFs,
// at most 3 files of up to 5 MB each.

export const ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const ATTACHMENT_ACCEPT = ATTACHMENT_TYPES.join(",");
export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

/** Why these files can't go (null: they can). */
export function attachmentProblem(files: readonly File[]): string | null {
  if (files.length > MAX_ATTACHMENTS) {
    return `Anexe no máximo ${MAX_ATTACHMENTS} arquivos.`;
  }
  for (const file of files) {
    if (!ATTACHMENT_TYPES.includes(file.type)) {
      return `“${file.name}”: anexe só imagens (JPG, PNG, WEBP) ou PDF.`;
    }
    if (file.size === 0) return `“${file.name}” está vazio.`;
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return `“${file.name}” passa de 5 MB.`;
    }
  }
  return null;
}

/** "1,2 MB", "340 KB". */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
