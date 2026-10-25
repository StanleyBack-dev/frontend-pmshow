"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Send } from "lucide-react";
import { Alert, Button, Field, Modal, Select, TextArea } from "@/design-system";
import { broadcastsClient } from "@/features/broadcasts/api/broadcasts.client";
import {
  AUDIENCES,
  AUDIENCE_LABELS,
} from "@/features/broadcasts/model/broadcast-labels";
import {
  SECTIONS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import type { BroadcastAudience } from "@/shared/contracts/broadcasts";
import type { Section } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";

type EventOption = { id: string; label: string };

// New announcement: who receives it, the message, and whether it also goes
// by e-mail. Sending can't be undone, so it asks for confirmation.
export function BroadcastForm({ events }: { events: EventOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<BroadcastAudience>("TODOS");
  const [section, setSection] = useState<Section | "">("");
  const [eventId, setEventId] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const target =
    audience === "NAIPE"
      ? section
        ? `o naipe ${SECTION_LABELS[section]}`
        : null
      : audience === "ESCALA_EVENTO"
        ? (events.find((event) => event.id === eventId)?.label ?? null)
        : "toda a banda";
  const valid =
    title.trim().length >= 3 && body.trim().length >= 3 && target !== null;

  async function send() {
    setPending(true);
    setError(null);
    try {
      const result = await broadcastsClient.send({
        title: title.trim(),
        body: body.trim(),
        audience,
        section: audience === "NAIPE" ? (section as Section) : null,
        eventId: audience === "ESCALA_EVENTO" ? eventId : null,
        sendEmail,
      });
      setSent(
        `Comunicado enviado para ${result.recipients} pessoa${result.recipients === 1 ? "" : "s"}.`,
      );
      setTitle("");
      setBody("");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível enviar.",
      );
    }
    setConfirmOpen(false);
    setPending(false);
  }

  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      {sent && <Alert tone="success">{sent}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Para"
          required
          value={audience}
          options={AUDIENCES.map((value) => ({
            value,
            label: AUDIENCE_LABELS[value],
          }))}
          onChange={(e) => setAudience(e.target.value as BroadcastAudience)}
        />
        {audience === "NAIPE" && (
          <Select
            label="Naipe"
            required
            placeholder="Escolha"
            value={section}
            options={SECTIONS.map((value) => ({
              value,
              label: SECTION_LABELS[value],
            }))}
            onChange={(e) => setSection(e.target.value as Section | "")}
          />
        )}
        {audience === "ESCALA_EVENTO" && (
          <Select
            label="Evento"
            required
            placeholder={events.length ? "Escolha" : "Nenhum evento próximo"}
            value={eventId}
            options={events.map((event) => ({
              value: event.id,
              label: event.label,
            }))}
            onChange={(e) => setEventId(e.target.value)}
          />
        )}
      </div>
      <Field
        label="Título"
        required
        maxLength={120}
        value={title}
        onChange={(e) => {
          setSent(null);
          setTitle(e.target.value);
        }}
      />
      <TextArea
        label="Mensagem"
        required
        rows={5}
        maxLength={2000}
        value={body}
        onChange={(e) => {
          setSent(null);
          setBody(e.target.value);
        }}
      />
      <label className="flex items-center gap-2 text-sm text-fg">
        <input
          type="checkbox"
          className="size-4 accent-[var(--accent)]"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
        />
        Também enviar por e-mail
      </label>
      <Button
        icon={<Send className="size-4" />}
        disabled={!valid}
        onClick={() => setConfirmOpen(true)}
      >
        Enviar comunicado
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Enviar comunicado"
        icon={<Megaphone className="size-5" />}
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={pending}
            >
              Voltar
            </Button>
            <Button onClick={send} loading={pending}>
              Enviar
            </Button>
          </>
        }
      >
        &ldquo;{title.trim()}&rdquo; vai para {target} no app
        {sendEmail ? ", por e-mail" : ""} e nos aparelhos com notificação
        ativada. Depois de enviado, não dá para desfazer.
      </Modal>
    </div>
  );
}
