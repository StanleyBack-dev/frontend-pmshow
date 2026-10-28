"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Check, Paperclip, X } from "lucide-react";
import { Button, Modal, TextArea } from "@/design-system";
import { absencesClient } from "@/features/availability/api/absences.client";
import {
  ABSENCE_TYPE_LABELS,
  formatPeriod,
} from "@/features/availability/model/absence-labels";
import type { Absence } from "@/shared/contracts/absences";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Dialog = "approve" | "deny" | "cancel";

const DIALOGS: Record<Dialog, { title: string; confirm: string }> = {
  approve: { title: "Aprovar indisponibilidade", confirm: "Aprovar" },
  deny: { title: "Recusar indisponibilidade", confirm: "Recusar" },
  cancel: { title: "Cancelar indisponibilidade", confirm: "Cancelar" },
};

// Review (managers, pending requests) and cancel. The API decides who may
// cancel what; `canCancel` only hides the button when it would be refused.
export function AbsenceActions({
  absence,
  canReview,
  canCancel,
  fill = false,
}: {
  absence: Absence;
  canReview: boolean;
  canCancel: boolean;
  /** Phones' collapse: the buttons share the width, centered. */
  fill?: boolean;
}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [note, setNote] = useState("");
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function run() {
    if (!dialog) return;
    setPending(true);
    try {
      if (dialog === "cancel") await absencesClient.cancel(absence.id);
      else
        await absencesClient.review(
          absence.id,
          dialog === "approve",
          note.trim() || null,
        );
      setDialog(null);
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  const openDialog = (kind: Dialog) => {
    setNote("");
    setDialog(kind);
  };

  const reviewable = canReview && absence.status === "PENDENTE";
  if (!reviewable && !canCancel) return null;

  return (
    <>
      <div
        className={
          fill
            ? "grid auto-cols-fr grid-flow-col gap-2 [&>button]:justify-center"
            : "flex flex-wrap gap-2"
        }
      >
        {reviewable && (
          <>
            <Button
              size="sm"
              icon={<Check className="size-4" />}
              onClick={() => openDialog("approve")}
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={<X className="size-4" />}
              onClick={() => openDialog("deny")}
            >
              Recusar
            </Button>
          </>
        )}
        {canCancel && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => openDialog("cancel")}
          >
            Cancelar
          </Button>
        )}
      </div>
      <Modal
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog ? DIALOGS[dialog].title : ""}
        icon={
          dialog === "approve" ? (
            <Check className="size-5" />
          ) : dialog === "deny" ? (
            <X className="size-5" />
          ) : (
            <Ban className="size-5" />
          )
        }
        tone={dialog === "approve" ? "neutral" : "danger"}
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDialog(null)}
              disabled={pending}
            >
              Voltar
            </Button>
            <Button
              variant={dialog === "approve" ? "primary" : "danger"}
              onClick={run}
              loading={pending}
            >
              {dialog ? DIALOGS[dialog].confirm : ""}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <AbsenceSummary absence={absence} />
          {dialog === "cancel" ? (
            <p>
              A indisponibilidade deixa de valer e a pessoa volta a poder ser
              escalada.
            </p>
          ) : (
            <>
              <p>
                {absence.warName ?? absence.userName} recebe a resposta no app e
                por e-mail.
              </p>
              <TextArea
                label="Observação (opcional)"
                rows={2}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

// What the dialog is about: who, which kind and when.
function AbsenceSummary({ absence }: { absence: Absence }) {
  const files = absence.attachments.length;
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-lg border border-border bg-surface-muted px-4 py-3">
      <dt className="text-soft">Integrante</dt>
      <dd className="font-medium break-words text-fg">
        {absence.userName}
        {absence.warName && (
          <span className="block text-xs font-normal text-soft">
            {absence.warName}
          </span>
        )}
      </dd>
      <dt className="text-soft">Tipo</dt>
      <dd className="break-words text-fg">
        {ABSENCE_TYPE_LABELS[absence.type]}
      </dd>
      <dt className="text-soft">Período</dt>
      <dd className="break-words text-fg">
        {formatPeriod(absence.startsOn, absence.endsOn)}
      </dd>
      {absence.reason && (
        <>
          <dt className="text-soft">Motivo</dt>
          <dd className="line-clamp-3 break-words whitespace-pre-line text-fg">
            {absence.reason}
          </dd>
        </>
      )}
      {files > 0 && (
        <>
          <dt className="text-soft">Anexos</dt>
          <dd className="inline-flex items-center gap-1 text-fg">
            <Paperclip aria-hidden className="size-3.5 text-soft" />
            {files} {files === 1 ? "arquivo" : "arquivos"}
          </dd>
        </>
      )}
    </dl>
  );
}
