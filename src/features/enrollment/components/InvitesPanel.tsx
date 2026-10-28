"use client";

import { auditColumn } from "@/features/audit/components/RecordAudit";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  Check,
  Copy,
  Link2,
  MessageCircle,
  Plus,
  Share2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Field,
  Modal,
  Select,
  type DataTableColumn,
  type Tone,
} from "@/design-system";
import { CopyShareValue } from "@/features/admin/components/CopyShareValue";
import { enrollmentClient } from "@/features/enrollment/api/enrollment.client";
import type { EnrollmentInvite } from "@/shared/contracts/enrollment";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/format";
import { useToast } from "@/shared/toast/useToast";

const VALIDITY_DAYS = [1, 3, 7, 15, 30];

const iconButton =
  "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg";

function inviteState(invite: EnrollmentInvite): { label: string; tone: Tone } {
  if (invite.revokedAt) return { label: "Cancelado", tone: "neutral" };
  if (new Date(invite.expiresAt) <= new Date())
    return { label: "Expirado", tone: "neutral" };
  return { label: "Ativo", tone: "success" };
}

const isOpen = (invite: EnrollmentInvite) =>
  inviteState(invite).tone === "success";

function shareMessage(invite: EnrollmentInvite): string {
  const link = `${window.location.origin}/cadastro`;
  return (
    "Olá! 🎺\n\n" +
    "Faça o seu cadastro no PM SHOW, o app da Banda da Polícia Militar de Goiás.\n\n" +
    `🔗 *Link:* ${link}\n` +
    `🔑 *Código:* ${invite.code}\n\n` +
    `O código vale até ${formatDateTime(invite.expiresAt)}. ` +
    "Depois de enviar, o acesso é liberado com a aprovação da administração e chega no seu e-mail."
  );
}

// The cohort code: one code for everyone, shared over WhatsApp.
export function InvitesPanel({ invites }: { invites: EnrollmentInvite[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [sharing, setSharing] = useState<EnrollmentInvite | null>(null);
  const [revoking, setRevoking] = useState<EnrollmentInvite | null>(null);

  const audit = auditColumn((invite: EnrollmentInvite) => ({
    entity: "enrollment_invite" as const,
    id: invite.id,
    label: invite.label,
  }));
  const columns: DataTableColumn<EnrollmentInvite>[] = [
    {
      key: "label",
      label: "Nome do convite",
      mobile: "title",
      render: (invite) => (
        <span className="font-medium break-words text-fg">{invite.label}</span>
      ),
    },
    {
      key: "code",
      label: "Código",
      render: (invite) => (
        <CopyShareValue
          value={invite.code}
          label="Código"
          share={false}
          valueClassName="font-mono font-semibold tracking-wider text-fg"
        />
      ),
    },
    {
      key: "expires",
      label: "Válido até",
      className: "whitespace-nowrap",
      render: (invite) => formatDateTime(invite.expiresAt),
    },
    {
      key: "requests",
      label: "Cadastros",
      render: (invite) => invite.requestCount,
    },
    {
      key: "status",
      label: "Situação",
      render: (invite) => {
        const state = inviteState(invite);
        return <Badge tone={state.tone}>{state.label}</Badge>;
      },
    },
    {
      key: "actions",
      label: "",
      mobile: "control",
      className: "w-24 text-right",
      render: (invite) =>
        isOpen(invite) && (
          <span className="inline-flex gap-1">
            <button
              type="button"
              onClick={() => setSharing(invite)}
              aria-label={`Compartilhar ${invite.label}`}
              title="Compartilhar"
              className={iconButton}
            >
              <Share2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setRevoking(invite)}
              aria-label={`Cancelar ${invite.label}`}
              title="Cancelar código"
              className={iconButton}
            >
              <Ban className="size-4" />
            </button>
          </span>
        ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          icon={<Plus className="size-4" />}
          onClick={() => setCreating(true)}
        >
          Gerar código
        </Button>
      </div>
      <Card>
        {invites.length === 0 ? (
          <EmptyState
            icon={<Link2 className="size-5" />}
            title="Nenhum código gerado"
            description="Gere um código e envie o link pelo WhatsApp. Cada músico preenche os próprios dados, e o cadastro aguarda a aprovação na aba Cadastros."
          />
        ) : (
          <DataTable
            rows={invites}
            columns={[...columns, audit.column]}
            getId={(invite) => invite.id}
            renderExpanded={audit.renderExpanded}
          />
        )}
      </Card>

      {creating && (
        <CreateInviteModal
          onClose={() => setCreating(false)}
          onCreated={(invite) => {
            setCreating(false);
            setSharing(invite);
            router.refresh();
          }}
        />
      )}
      {sharing && (
        <ShareInviteModal invite={sharing} onClose={() => setSharing(null)} />
      )}
      {revoking && (
        <RevokeInviteModal
          invite={revoking}
          onClose={() => setRevoking(null)}
          onRevoked={() => {
            setRevoking(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function CreateInviteModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (invite: EnrollmentInvite) => void;
}) {
  const [label, setLabel] = useState("");
  const [validDays, setValidDays] = useState(7);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);
  const valid = label.trim().length >= 2;

  async function submit() {
    setPending(true);
    try {
      onCreated(await enrollmentClient.createInvite({ label, validDays }));
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível gerar o código.",
      );
      setPending(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Gerar código da turma"
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={submit} loading={pending} disabled={!valid}>
            Gerar código
          </Button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) void submit();
        }}
      >
        <Field
          label="Nome do convite"
          required
          data-autofocus
          maxLength={80}
          placeholder="Ex.: Integrantes 2026"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Select
          label="Validade"
          required
          value={String(validDays)}
          onChange={(e) => setValidDays(Number(e.target.value))}
          options={VALIDITY_DAYS.map((days) => ({
            value: String(days),
            label: days === 1 ? "1 dia" : `${days} dias`,
          }))}
        />
        <p className="text-xs text-soft">
          O mesmo código serve para todos da turma até vencer. Você pode
          cancelá-lo a qualquer momento.
        </p>
      </form>
    </Modal>
  );
}

function ShareInviteModal({
  invite,
  onClose,
}: {
  invite: EnrollmentInvite;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const text = shareMessage(invite);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard blocked: the message is on screen to copy by hand.
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Enviar o código"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={copy}
            icon={
              copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )
            }
          >
            {copied ? "Copiada" : "Copiar mensagem"}
          </Button>
          <Button
            icon={<MessageCircle className="size-4" />}
            onClick={() =>
              // No number: WhatsApp asks which chat or group to send to.
              window.open(
                `https://wa.me/?text=${encodeURIComponent(text)}`,
                "_blank",
                "noopener",
              )
            }
          >
            Enviar pelo WhatsApp
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Envie no grupo da banda ou para cada músico.
        </p>
        <pre className="rounded-lg border border-border bg-surface-muted p-3 text-[13px] whitespace-pre-wrap text-fg">
          {text}
        </pre>
      </div>
    </Modal>
  );
}

function RevokeInviteModal({
  invite,
  onClose,
  onRevoked,
}: {
  invite: EnrollmentInvite;
  onClose: () => void;
  onRevoked: () => void;
}) {
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function revoke() {
    setPending(true);
    try {
      await enrollmentClient.revokeInvite(invite.id);
      onRevoked();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível cancelar o código.",
      );
      setPending(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Cancelar código"
      tone="danger"
      busy={pending}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Voltar
          </Button>
          <Button variant="danger" onClick={revoke} loading={pending}>
            Cancelar código
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">
        O código <strong className="font-mono text-fg">{invite.code}</strong> (
        {invite.label}) deixa de funcionar agora, inclusive para quem já está
        preenchendo. Os cadastros já enviados continuam aguardando análise.
      </p>
    </Modal>
  );
}
