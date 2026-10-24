"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarOff, Plus } from "lucide-react";
import {
  Alert,
  Button,
  Field,
  Modal,
  Select,
  TextArea,
  type ButtonVariant,
} from "@/design-system";
import { absencesClient } from "@/features/availability/api/absences.client";
import {
  ABSENCE_TYPES,
  ABSENCE_TYPE_LABELS,
} from "@/features/availability/model/absence-labels";
import type { AbsenceType } from "@/shared/contracts/absences";
import { ApiClientError } from "@/shared/lib/api-client";

type Member = { userId: string; label: string };

/**
 * Without `members`: the signed-in member asks for themself (pending review).
 * With `members`: a manager registers an absence for someone (approved).
 */
export function NewAbsenceButton({
  members,
  label,
  variant = "primary",
}: {
  members?: Member[];
  label: string;
  variant?: ButtonVariant;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [type, setType] = useState<AbsenceType>("FERIAS");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const forSomeone = members !== undefined;
  const valid =
    startsOn !== "" &&
    endsOn !== "" &&
    endsOn >= startsOn &&
    (!forSomeone || userId !== "");

  function start() {
    setUserId("");
    setType("FERIAS");
    setStartsOn("");
    setEndsOn("");
    setReason("");
    setError(null);
    setOpen(true);
  }

  async function submit() {
    setPending(true);
    setError(null);
    const input = { type, startsOn, endsOn, reason: reason.trim() || null };
    try {
      if (forSomeone) await absencesClient.register(userId, input);
      else await absencesClient.request(input);
      setOpen(false);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  return (
    <>
      <Button
        variant={variant}
        icon={<Plus className="size-4" />}
        onClick={start}
      >
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          forSomeone ? "Lançar indisponibilidade" : "Pedir indisponibilidade"
        }
        icon={<CalendarOff className="size-5" />}
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button onClick={submit} loading={pending} disabled={!valid}>
              {forSomeone ? "Lançar" : "Enviar pedido"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <Alert tone="danger">{error}</Alert>}
          {forSomeone ? (
            <p className="text-sm text-muted">
              Entra já aprovada e bloqueia a pessoa nas escalas do período.
            </p>
          ) : (
            <p className="text-sm text-muted">
              Um gestor analisa o pedido. Aprovado, você não é escalado no
              período.
            </p>
          )}
          {forSomeone && (
            <Select
              label="Integrante"
              placeholder="Escolha"
              value={userId}
              options={members.map((m) => ({
                value: m.userId,
                label: m.label,
              }))}
              onChange={(e) => setUserId(e.target.value)}
            />
          )}
          <Select
            label="Motivo"
            value={type}
            options={ABSENCE_TYPES.map((value) => ({
              value,
              label: ABSENCE_TYPE_LABELS[value],
            }))}
            onChange={(e) => setType(e.target.value as AbsenceType)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="De"
              type="date"
              value={startsOn}
              onChange={(e) => {
                setStartsOn(e.target.value);
                if (!endsOn || endsOn < e.target.value) {
                  setEndsOn(e.target.value);
                }
              }}
            />
            <Field
              label="Até (inclusive)"
              type="date"
              min={startsOn || undefined}
              value={endsOn}
              onChange={(e) => setEndsOn(e.target.value)}
            />
          </div>
          <TextArea
            label="Observação (opcional)"
            hint="Não informe diagnóstico nem dados de saúde: o tipo e o período bastam."
            rows={2}
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
