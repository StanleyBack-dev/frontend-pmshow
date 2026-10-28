"use client";

import { useState } from "react";
import { FileDown, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/design-system";
import { useToast } from "@/shared/toast/useToast";

const fileNameOf = (response: Response) =>
  /filename="([^"]+)"/.exec(
    response.headers.get("Content-Disposition") ?? "",
  )?.[1] ?? "escala.pdf";

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// "PDF" downloads the roster; the WhatsApp button shares the file itself
// where the browser can (phones: pick WhatsApp in the share sheet). Elsewhere
// it downloads the PDF and opens WhatsApp to attach it.
export function RosterPdfActions({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const href = `/api/events/${eventId}/roster/pdf`;
  const text = `Escala: ${eventTitle}`;

  async function share() {
    const canShareFiles =
      typeof navigator.canShare === "function" &&
      navigator.canShare({
        files: [new File([""], "escala.pdf", { type: "application/pdf" })],
      });
    // Opened now, while the click still counts (popup blockers).
    if (!canShareFiles) {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener",
      );
    }
    setPending(true);
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      const fileName = fileNameOf(response);
      if (canShareFiles) {
        const file = new File([blob], fileName, { type: "application/pdf" });
        await navigator.share({ files: [file], title: text, text });
      } else {
        download(blob, fileName);
        showSuccess(
          "PDF baixado.",
          "Anexe o arquivo na conversa do WhatsApp que abriu.",
        );
      }
    } catch (cause) {
      // Closing the share sheet is not an error.
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        showError("Não foi possível compartilhar o PDF da escala.");
      }
    }
    setPending(false);
  }

  return (
    <>
      {/* A file download, not a page: plain anchor on purpose. */}
      <a href={href} download className={buttonClasses("ghost", "sm")}>
        <FileDown className="size-4" />
        PDF
      </a>
      <button
        type="button"
        onClick={() => void share()}
        disabled={pending}
        aria-label="Enviar o PDF da escala pelo WhatsApp"
        title="Enviar PDF pelo WhatsApp"
        className={buttonClasses("ghost", "sm")}
      >
        <MessageCircle className="size-4" />
        WhatsApp
      </button>
    </>
  );
}
