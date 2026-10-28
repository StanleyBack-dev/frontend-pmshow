"use client";

import { Copy, MessageCircle } from "lucide-react";
import { cn } from "@/design-system";
import { useToast } from "@/shared/toast/useToast";

const iconButton =
  "grid size-7 shrink-0 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg";

// A value in a table cell (e-mail, login, code…) with two shortcuts: copy it
// and send it by WhatsApp (no number: WhatsApp asks which chat to send to).
export function CopyShareValue({
  value,
  label,
  share = true,
  valueClassName = "text-muted",
}: {
  value: string;
  /** What the value is, for the buttons and the toast ("E-mail"). */
  label: string;
  /** false: only the copy button. */
  share?: boolean;
  valueClassName?: string;
}) {
  const { showSuccess, showError } = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      showSuccess(`${label} copiado.`);
    } catch {
      showError(`Não foi possível copiar o ${label.toLowerCase()}.`);
    }
  }

  return (
    <span className="inline-flex max-w-full items-center gap-1">
      <span className={cn("min-w-0 truncate", valueClassName)}>{value}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copiar ${label.toLowerCase()}`}
        title="Copiar"
        className={iconButton}
      >
        <Copy className="size-3.5" />
      </button>
      {share && (
        <button
          type="button"
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(value)}`,
              "_blank",
              "noopener",
            )
          }
          aria-label={`Enviar ${label.toLowerCase()} pelo WhatsApp`}
          title="Enviar pelo WhatsApp"
          className={iconButton}
        >
          <MessageCircle className="size-3.5" />
        </button>
      )}
    </span>
  );
}
