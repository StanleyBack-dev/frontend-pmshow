"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Alert, Button, Modal, TextArea } from "@/design-system";
import { absencesClient } from "@/features/availability/api/absences.client";
import type { Absence } from "@/shared/contracts/absences";
import { ApiClientError } from "@/shared/lib/api-client";

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
}: {
  absence: Absence;
  canReview: boolean;
  canCancel: boolean;
}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run() {
    if (!dialog) return;
    setPending(true);
    setError(null);
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
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  const openDialog = (kind: Dialog) => {
    setNote("");
    setError(null);
    setDialog(kind);
  };

  const reviewable = canReview && absence.status === "PENDENTE";
  if (!reviewable && !canCancel) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
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
            variant="ghost"
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
        <div className="space-y-3">
          {error && <Alert tone="danger">{error}</Alert>}
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
