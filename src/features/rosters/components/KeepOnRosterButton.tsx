"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Button, Modal, TextArea } from "@/design-system";
import { rostersClient } from "@/features/rosters/api/rosters.client";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Doesn't accept a swap request: the person stays on the roster, answers
// again ("ciente") and is told why (in the app and by e-mail).
export function KeepOnRosterButton({
  eventId,
  userId,
  personName,
  size = "sm",
  fill = false,
  onKept,
}: {
  eventId: string;
  userId: string;
  personName: string;
  size?: "sm" | "md";
  /** Phones: the button takes the width it is given. */
  fill?: boolean;
  onKept: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const { showError, showSuccess } = useToast();

  async function keep() {
    setPending(true);
    try {
      await rostersClient.keepOnRoster(eventId, userId, note.trim() || null);
      showSuccess(
        "Pedido de troca não aceito.",
        `${personName} continua na escala e foi avisado.`,
      );
      setOpen(false);
      onKept();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  return (
    <>
      <Button
        size={size}
        variant="secondary"
        icon={<UserCheck className="size-4" />}
        className={fill ? "w-full justify-center" : undefined}
        onClick={() => {
          setNote("");
          setOpen(true);
        }}
      >
        Manter na escala
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Manter na escala"
        icon={<UserCheck className="size-5" />}
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Voltar
            </Button>
            <Button onClick={keep} loading={pending}>
              Manter e avisar
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p>
            O pedido de troca de{" "}
            <span className="font-medium text-fg">{personName}</span> não será
            aceito: a pessoa continua na escala, recebe o aviso no app e por
            e-mail com o seu nome e precisa confirmar a ciência de novo.
          </p>
          <TextArea
            label="Observação para a pessoa (opcional)"
            rows={2}
            maxLength={300}
            placeholder="Ex.: não há substituto disponível para esse instrumento."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
