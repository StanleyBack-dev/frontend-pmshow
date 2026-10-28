"use client";

import { useState } from "react";
import { CalendarPlus, Link2Off, RefreshCw, Smartphone } from "lucide-react";
import { Button, Modal, buttonClasses } from "@/design-system";
import { CopyShareValue } from "@/features/admin/components/CopyShareValue";
import type { CalendarFeedLinks } from "@/shared/contracts/calendar";
import { apiRequest, ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/datetime";
import { useToast } from "@/shared/toast/useToast";

// The person's agenda link: subscribe once and the phone's calendar shows
// the rosters and working days by itself (updates included). A new link turns
// the old one off; turning it off removes the calendar's access.
export function CalendarFeedPanel({
  initial,
}: {
  initial: CalendarFeedLinks | null;
}) {
  const { showError, showSuccess } = useToast();
  const [links, setLinks] = useState(initial);
  const [pending, setPending] = useState<"renew" | "remove" | null>(null);
  const [confirm, setConfirm] = useState<"renew" | "remove" | null>(null);

  async function renew() {
    setPending("renew");
    try {
      setLinks(
        await apiRequest<CalendarFeedLinks>("/me/calendar", {
          method: "POST",
        }),
      );
      showSuccess(
        links ? "Novo link criado." : "Link criado.",
        links
          ? "O link anterior parou de funcionar: assine de novo nos aparelhos."
          : "Agora assine na agenda do seu celular.",
      );
      setConfirm(null);
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(null);
  }

  async function remove() {
    setPending("remove");
    try {
      await apiRequest("/me/calendar", { method: "DELETE" });
      setLinks(null);
      showSuccess("Link desativado.", "A agenda do celular para de atualizar.");
      setConfirm(null);
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(null);
  }

  if (!links) {
    return (
      <div className="space-y-3">
        <p className="text-[13px] text-muted">
          Crie o seu link pessoal e assine uma vez no Google Agenda ou no
          iPhone: os eventos em que você está escalado e os seus expedientes
          aparecem sozinhos, e as mudanças também.
        </p>
        <Button
          icon={<CalendarPlus className="size-4" />}
          loading={pending === "renew"}
          onClick={renew}
        >
          Criar meu link de agenda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <a
          href={links.google}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary")}
        >
          <CalendarPlus aria-hidden className="size-4" />
          Adicionar ao Google Agenda
        </a>
        <a href={links.webcal} className={buttonClasses("secondary")}>
          <Smartphone aria-hidden className="size-4" />
          Adicionar ao iPhone / Mac
        </a>
      </div>

      <div className="rounded-lg border border-border bg-surface-muted px-4 py-3">
        <p className="text-[11px] font-semibold tracking-[0.07em] text-soft uppercase">
          Link da agenda (Outlook e outros apps)
        </p>
        <div className="mt-1 text-[13px] break-all">
          <CopyShareValue
            value={links.https}
            label="Link da agenda"
            share={false}
          />
        </div>
        <p className="mt-2 text-xs text-soft">
          Criado em {formatDateTime(links.createdAt)}. Não compartilhe: quem
          tiver o link vê a sua agenda.
        </p>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
        <li>
          O Google Agenda atualiza assinaturas de tempos em tempos (pode levar
          algumas horas); o iPhone, conforme a configuração de “Buscar”.
        </li>
        <li>
          No Google, a agenda assinada aparece no celular após abrir o app.
        </li>
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          icon={<RefreshCw className="size-4" />}
          onClick={() => setConfirm("renew")}
        >
          Gerar novo link
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<Link2Off className="size-4" />}
          onClick={() => setConfirm("remove")}
        >
          Desativar
        </Button>
      </div>

      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        busy={pending !== null}
        tone={confirm === "remove" ? "danger" : "neutral"}
        title={confirm === "remove" ? "Desativar o link" : "Gerar novo link"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirm(null)}
              disabled={pending !== null}
            >
              Voltar
            </Button>
            <Button
              variant={confirm === "remove" ? "danger" : "primary"}
              loading={pending !== null}
              onClick={confirm === "remove" ? remove : renew}
            >
              {confirm === "remove" ? "Desativar" : "Gerar novo link"}
            </Button>
          </>
        }
      >
        {confirm === "remove"
          ? "A agenda assinada nos seus aparelhos para de atualizar. Você pode criar um novo link depois."
          : "Use se o link vazou: o atual para de funcionar e você assina o novo nos seus aparelhos."}
      </Modal>
    </div>
  );
}
