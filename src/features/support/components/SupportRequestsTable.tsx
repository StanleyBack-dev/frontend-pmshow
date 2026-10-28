"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageSquareReply } from "lucide-react";
import {
  Badge,
  Button,
  DataTable,
  Modal,
  TextArea,
  type DataTableColumn,
} from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { supportClient } from "@/features/support/api/support.client";
import {
  SUPPORT_CATEGORY_LABELS,
  SUPPORT_STATUS,
  protocolLabel,
} from "@/features/support/model/support-labels";
import type { SupportRequest } from "@/shared/contracts/support";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/datetime";
import { useToast } from "@/shared/toast/useToast";

// Same first answer as Vaulto's, for the administrator to start from.
const DEFAULT_REPLY =
  "Olá! Obrigado por entrar em contato com o suporte do PM SHOW. " +
  "Analisamos a sua solicitação e ela já está sendo tratada. " +
  "Se precisar de mais alguma coisa, é só abrir uma nova solicitação.";

const multiline = (text: string | null) =>
  text ? <span className="whitespace-pre-line">{text}</span> : "—";

// Support requests (amoremio table). "Minhas": the person's own, read only.
// `manage` (administrators): everyone's, with "Responder" and "Finalizar".
export function SupportRequestsTable({
  requests,
  manage = false,
}: {
  requests: SupportRequest[];
  manage?: boolean;
}) {
  const [replying, setReplying] = useState<SupportRequest | null>(null);
  const [finalizing, setFinalizing] = useState<SupportRequest | null>(null);
  const audit = auditColumn((request: SupportRequest) => ({
    entity: "support_request" as const,
    id: request.id,
    label: `Suporte ${protocolLabel(request.protocol)}`,
    createdAt: request.createdAt,
  }));
  const open = (request: SupportRequest) => request.status !== "FINALIZADO";

  const actions = (request: SupportRequest, fill = false) =>
    manage && open(request) ? (
      <div
        className={
          fill
            ? "grid grid-cols-2 gap-2 [&>button]:justify-center"
            : "flex flex-wrap justify-end gap-2"
        }
      >
        <Button
          size="sm"
          icon={<MessageSquareReply className="size-4" />}
          onClick={() => setReplying(request)}
        >
          {request.reply ? "Responder de novo" : "Responder"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={<CheckCircle2 className="size-4" />}
          onClick={() => setFinalizing(request)}
        >
          Finalizar
        </Button>
      </div>
    ) : null;

  const columns: DataTableColumn<SupportRequest>[] = [
    {
      key: "protocol",
      label: "Protocolo",
      className: "whitespace-nowrap tabular-nums",
      mobile: "detail",
      render: (request) => protocolLabel(request.protocol),
    },
    ...(manage
      ? [
          {
            key: "person",
            label: "Quem pediu",
            render: (request: SupportRequest) => (
              <span>
                <span className="block font-medium text-fg">
                  {request.userName}
                </span>
                {request.warName && (
                  <span className="block text-xs text-soft">
                    {request.warName}
                  </span>
                )}
              </span>
            ),
          },
        ]
      : []),
    {
      key: "subject",
      label: "Assunto",
      mobile: "title",
      render: (request) => (
        <span className="font-medium text-fg">{request.subject}</span>
      ),
    },
    {
      key: "category",
      label: "Categoria",
      mobile: "subtitle",
      render: (request) => SUPPORT_CATEGORY_LABELS[request.category],
    },
    {
      key: "status",
      label: "Situação",
      mobile: "control",
      render: (request) => (
        <Badge tone={SUPPORT_STATUS[request.status].tone}>
          {SUPPORT_STATUS[request.status].label}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Enviada em",
      className: "whitespace-nowrap",
      render: (request) => formatDateTime(request.createdAt),
    },
    {
      key: "message",
      label: "Mensagem",
      desktop: "detail",
      render: (request) => multiline(request.message),
    },
    {
      key: "reply",
      label: "Resposta do suporte",
      desktop: "detail",
      render: (request) => multiline(request.reply),
    },
    {
      key: "replied",
      label: "Respondida por / em",
      desktop: "detail",
      render: (request) =>
        request.repliedAt
          ? `${request.repliedByName ?? "—"} · ${formatDateTime(request.repliedAt)}`
          : "—",
    },
    {
      key: "finalized",
      label: "Finalizada por / em",
      desktop: "detail",
      render: (request) =>
        request.finalizedAt
          ? `${request.finalizedByName ?? "—"} · ${formatDateTime(request.finalizedAt)}`
          : "—",
    },
    ...(manage
      ? [
          {
            key: "actions",
            label: "",
            className: "whitespace-nowrap text-right",
            // Phones: at the end of the collapse (renderExpanded).
            mobile: "hidden" as const,
            render: (request: SupportRequest) => actions(request),
          },
        ]
      : []),
  ];

  return (
    <>
      <DataTable
        rows={requests}
        columns={[...columns, audit.column]}
        getId={(request) => request.id}
        renderExpanded={(request) => (
          <>
            {manage && open(request) && (
              <div className="border-t border-border px-3 py-3">
                {actions(request, true)}
              </div>
            )}
            {audit.renderExpanded(request)}
          </>
        )}
      />
      {replying && (
        <ReplyModal request={replying} onClose={() => setReplying(null)} />
      )}
      {finalizing && (
        <FinalizeModal
          request={finalizing}
          onClose={() => setFinalizing(null)}
        />
      )}
    </>
  );
}

function ReplyModal({
  request,
  onClose,
}: {
  request: SupportRequest;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [reply, setReply] = useState("");
  const [useDefault, setUseDefault] = useState(false);
  const [pending, setPending] = useState(false);

  async function send() {
    setPending(true);
    try {
      await supportClient.reply(request.id, reply);
      showSuccess(
        "Resposta enviada.",
        `${request.userName} foi avisado no app e por e-mail.`,
      );
      onClose();
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível enviar a resposta.",
      );
    }
    setPending(false);
  }

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      busy={pending}
      icon={<MessageSquareReply className="size-5" />}
      title={`Responder ${protocolLabel(request.protocol)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Voltar
          </Button>
          <Button
            onClick={send}
            loading={pending}
            disabled={reply.trim().length < 2}
          >
            Enviar resposta
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <dl className="space-y-2 rounded-lg border border-border bg-surface-muted px-4 py-3">
          <div>
            <dt className="text-[10px] font-medium tracking-wide text-soft uppercase">
              {request.userName} · {SUPPORT_CATEGORY_LABELS[request.category]}
            </dt>
            <dd className="font-medium text-fg">{request.subject}</dd>
          </div>
          <dd className="whitespace-pre-line text-fg">{request.message}</dd>
        </dl>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
          <input
            type="checkbox"
            className="size-4 accent-[var(--accent)]"
            checked={useDefault}
            onChange={(event) => {
              setUseDefault(event.target.checked);
              setReply(event.target.checked ? DEFAULT_REPLY : "");
            }}
          />
          Usar a resposta padrão
        </label>
        <TextArea
          label="Resposta"
          required
          rows={5}
          maxLength={2000}
          value={reply}
          onChange={(event) => setReply(event.target.value)}
        />
      </div>
    </Modal>
  );
}

function FinalizeModal({
  request,
  onClose,
}: {
  request: SupportRequest;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState(false);

  async function finalize() {
    setPending(true);
    try {
      await supportClient.finalize(request.id);
      showSuccess(
        `Solicitação ${protocolLabel(request.protocol)} finalizada.`,
        `${request.userName} foi avisado.`,
      );
      onClose();
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível finalizar.",
      );
    }
    setPending(false);
  }

  return (
    <Modal
      open
      onClose={onClose}
      busy={pending}
      icon={<CheckCircle2 className="size-5" />}
      title={`Finalizar ${protocolLabel(request.protocol)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Voltar
          </Button>
          <Button onClick={finalize} loading={pending}>
            Finalizar e avisar
          </Button>
        </>
      }
    >
      <p>
        A solicitação “{request.subject}” fica encerrada e não recebe mais
        respostas. {request.userName} é avisado no app e por e-mail
        {request.reply ? "" : " (ainda sem resposta)"}.
      </p>
    </Modal>
  );
}
