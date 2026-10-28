"use client";

import { useId, useRef } from "react";
import { FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { Button } from "@/design-system";
import {
  ATTACHMENT_ACCEPT,
  MAX_ATTACHMENTS,
  attachmentProblem,
  formatBytes,
} from "@/features/availability/model/absence-attachments";
import { useToast } from "@/shared/toast/useToast";

// Up to three images or PDFs for an absence request (a certificate, a
// mission order…). Checked here; the API and the storage check again.
export function AttachmentPicker({
  files,
  onChange,
  disabled = false,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const { showError } = useToast();

  function add(picked: FileList | null) {
    if (!picked) return;
    const next = [...files, ...Array.from(picked)];
    const problem = attachmentProblem(next);
    if (problem) showError(problem);
    else onChange(next);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[13px] font-medium text-fg">Anexos (opcional)</p>
          <p className="text-xs text-soft">
            Até {MAX_ATTACHMENTS} arquivos: imagens (JPG, PNG, WEBP) ou PDF, até
            5 MB cada.
          </p>
        </div>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={ATTACHMENT_ACCEPT}
          className="sr-only"
          onChange={(e) => add(e.target.files)}
        />
        <Button
          size="sm"
          variant="secondary"
          icon={<Paperclip className="size-4" />}
          disabled={disabled || files.length >= MAX_ATTACHMENTS}
          onClick={() => input.current?.click()}
        >
          Anexar arquivo
        </Button>
      </div>
      {files.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {files.map((file, index) => {
            const Icon = file.type === "application/pdf" ? FileText : ImageIcon;
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 px-3 py-2 text-sm"
              >
                <Icon aria-hidden className="size-4 shrink-0 text-soft" />
                <span className="min-w-0 flex-1 truncate text-fg">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-soft tabular-nums">
                  {formatBytes(file.size)}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onChange(files.filter((_, item) => item !== index))
                  }
                  aria-label={`Remover ${file.name}`}
                  title="Remover"
                  className="grid size-7 shrink-0 place-items-center rounded-md text-soft hover:bg-danger-soft hover:text-danger disabled:opacity-40"
                >
                  <X className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
