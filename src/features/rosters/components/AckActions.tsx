"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Repeat } from "lucide-react";
import { Alert, Button, Modal, TextArea } from "@/design-system";
import { rostersClient } from "@/features/rosters/api/rosters.client";
import type { AckStatus } from "@/shared/contracts/rosters";
import { ApiClientError } from "@/shared/lib/api-client";

// The member's answer to a published roster: "ciente" in one tap, or a
// request to be replaced (with the reason, sent to the manager).
export function AckActions({
  eventId,
  status,
}: {
  eventId: string;
  status: AckStatus;
}) {
  const router = useRouter();
  const [swapOpen, setSwapOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"ack" | "swap" | null>(null);

  async function answer(kind: "ack" | "swap") {
    setPending(kind);
    setError(null);
    try {
      await rostersClient.acknowledge(
        eventId,
        kind === "ack" ? "CIENTE" : "TROCA_SOLICITADA",
        kind === "swap" ? note : null,
      );
      setSwapOpen(false);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(null);
  }

  return (
    <div className="space-y-2">
      {error && !swapOpen && <Alert tone="danger">{error}</Alert>}
      <div className="flex flex-wrap gap-2">
        {status !== "CIENTE" && (
          <Button
            size="sm"
            icon={<CheckCircle2 className="size-4" />}
            loading={pending === "ack"}
            onClick={() => void answer("ack")}
          >
            Estou ciente
          </Button>
        )}
        {status !== "TROCA_SOLICITADA" && (
          <Button
            size="sm"
            variant="secondary"
            icon={<Repeat className="size-4" />}
            onClick={() => {
              setNote("");
              setError(null);
              setSwapOpen(true);
            }}
          >
            Pedir troca
          </Button>
        )}
      </div>
      <Modal
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        title="Pedir troca"
        icon={<Repeat className="size-5" />}
        busy={pending === "swap"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSwapOpen(false)}
              disabled={pending === "swap"}
            >
              Voltar
            </Button>
            <Button
              onClick={() => void answer("swap")}
              loading={pending === "swap"}
              disabled={!note.trim()}
            >
              Enviar pedido
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {error && <Alert tone="danger">{error}</Alert>}
          <p>
            O gestor que publicou a escala recebe o seu pedido. Você continua
            escalado até ele alterar a escala.
          </p>
          <TextArea
            label="Motivo"
            rows={3}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
