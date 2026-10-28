"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Button,
  Field,
  Drawer,
  Select,
  TextArea,
  type ButtonVariant,
} from "@/design-system";
import { absencesClient } from "@/features/availability/api/absences.client";
import { AttachmentPicker } from "@/features/availability/components/AttachmentPicker";
import {
  ABSENCE_TYPES,
  ABSENCE_TYPE_LABELS,
} from "@/features/availability/model/absence-labels";
import type { AbsenceType } from "@/shared/contracts/absences";
import { ApiClientError } from "@/shared/lib/api-client";
import { uploadToStorage } from "@/shared/lib/storage-upload";
import { useToast } from "@/shared/toast/useToast";

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
  const [files, setFiles] = useState<File[]>([]);
  const { showError, showSuccess } = useToast();
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
    setFiles([]);
    setOpen(true);
  }

  async function submit() {
    setPending(true);
    const input = { type, startsOn, endsOn, reason: reason.trim() || null };
    try {
      if (forSomeone) {
        await absencesClient.register(userId, input);
      } else {
        // The files go straight to storage first; the request then names them.
        const uploads =
          files.length > 0 ? await absencesClient.attachmentUploads(files) : [];
        await Promise.all(
          uploads.map((ticket, index) =>
            uploadToStorage(ticket, files[index]!, () => {}),
          ),
        );
        await absencesClient.request({
          ...input,
          attachments: uploads.map((ticket, index) => ({
            storageKey: ticket.storageKey,
            fileName: files[index]!.name,
          })),
        });
      }
      showSuccess(
        forSomeone ? "Indisponibilidade lançada." : "Pedido enviado.",
        forSomeone ? undefined : "Um gestor analisa e você recebe a resposta.",
      );
      setOpen(false);
      router.refresh();
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
        variant={variant}
        icon={<Plus className="size-4" />}
        onClick={start}
      >
        {label}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={
          forSomeone ? "Lançar indisponibilidade" : "Pedir indisponibilidade"
        }
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
              required
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
            required
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
              required
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
              required
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
          {!forSomeone && (
            <AttachmentPicker
              files={files}
              onChange={setFiles}
              disabled={pending}
            />
          )}
        </div>
      </Drawer>
    </>
  );
}
