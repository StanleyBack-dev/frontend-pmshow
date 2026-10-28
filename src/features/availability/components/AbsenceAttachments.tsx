"use client";

import { useState } from "react";
import { Download, Eye, FileText, ImageIcon, Paperclip } from "lucide-react";
import { Button, Modal, Spinner } from "@/design-system";
import { attachmentUrl } from "@/features/availability/api/absences.client";
import { formatBytes } from "@/features/availability/model/absence-attachments";
import type { AbsenceAttachment } from "@/shared/contracts/absences";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

const linkClasses =
  "inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline disabled:cursor-wait disabled:opacity-60 disabled:no-underline";

// "Ver" and "Baixar": the link is made on click (a short-lived one), with a
// spinner meanwhile so nobody clicks twice wondering.
function AttachmentLinks({ file }: { file: AbsenceAttachment }) {
  const [pending, setPending] = useState<"view" | "download" | null>(null);
  const { showError } = useToast();

  async function open(kind: "view" | "download") {
    // Opened right away (inside the click) or the browser blocks the tab.
    const tab = kind === "view" ? window.open("", "_blank") : null;
    setPending(kind);
    try {
      const url = await attachmentUrl(file.id, kind === "download");
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        // Saved as a file (the link says so), the page stays.
        window.location.assign(url);
      }
    } catch (cause) {
      tab?.close();
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível abrir o arquivo.",
      );
    }
    setPending(null);
  }

  return (
    <span className="flex gap-3">
      {(
        [
          ["view", "Ver", Eye],
          ["download", "Baixar", Download],
        ] as const
      ).map(([kind, label, Icon]) => (
        <button
          key={kind}
          type="button"
          disabled={pending !== null}
          onClick={() => open(kind)}
          className={linkClasses}
        >
          {pending === kind ? (
            <Spinner size="sm" label="Abrindo" />
          ) : (
            <Icon aria-hidden className="size-3.5" />
          )}
          {label}
        </button>
      ))}
    </span>
  );
}

/**
 * The files of a request as a list of cards: type icon, name and size, and
 * "Ver" (new tab) / "Baixar" under the name, so it reads well even on
 * narrow screens.
 */
export function AttachmentList({ files }: { files: AbsenceAttachment[] }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-surface text-left">
      {files.map((file) => {
        const Icon = file.mimeType === "application/pdf" ? FileText : ImageIcon;
        return (
          <li key={file.id} className="flex items-start gap-3 px-3 py-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-muted text-soft">
              <Icon aria-hidden className="size-4" />
            </span>
            <span className="min-w-0 flex-1 space-y-1">
              <span className="block text-[13px] font-medium break-all text-fg">
                {file.fileName}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs text-soft tabular-nums">
                  {formatBytes(file.sizeBytes)}
                </span>
                <AttachmentLinks file={file} />
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// Table cell: paperclip and count; a click opens the files in a modal.
export function AttachmentsButton({
  files,
  owner,
}: {
  files: AbsenceAttachment[];
  /** Whose request (modal subtitle). */
  owner: string;
}) {
  const [open, setOpen] = useState(false);
  if (files.length === 0) return <span className="text-soft">—</span>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Ver arquivos"
        aria-label={`Ver ${files.length} arquivo(s)`}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium text-accent tabular-nums transition-colors hover:bg-accent-soft"
      >
        <Paperclip aria-hidden className="size-4" />
        {files.length}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Arquivos da indisponibilidade"
        icon={<Paperclip className="size-5" />}
        footer={
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        }
      >
        <p className="mb-3">
          Enviados por <span className="font-medium text-fg">{owner}</span>.
        </p>
        <AttachmentList files={files} />
      </Modal>
    </>
  );
}
