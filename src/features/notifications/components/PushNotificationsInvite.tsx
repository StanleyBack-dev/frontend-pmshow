"use client";

import { useState } from "react";
import { BellRing, X } from "lucide-react";
import { Button } from "@/design-system";
import { useInstallInviteOpen } from "@/features/install/model/install-store";
import { pushClient } from "@/features/notifications/api/push.client";
import {
  dismissPushInvite,
  usePushInviteDismissed,
  usePushStatus,
} from "@/features/notifications/model/push-status";
import { usePlayer } from "@/features/player/components/PlayerProvider";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Invitation to turn notifications on, right after signing in, so nobody has
// to find the option in Configurações › Aplicativo. Browsers only show their
// permission prompt after a tap, hence the "Ativar" button. When they are
// blocked it explains how to unblock them. Same place and manners as the
// install invite: it waits for that one (and for the welcome tour), steps
// aside while the player is open, and "Agora não" asks again in a week.
export function PushNotificationsInvite({ hidden }: { hidden: boolean }) {
  const { support, status, setStatus } = usePushStatus();
  const playerOpen = Boolean(usePlayer().current);
  const { showError, showSuccess } = useToast();
  const dismissedBefore = usePushInviteDismissed();
  // The install invite goes first: one card at a time.
  const installInviteFirst = useInstallInviteOpen();
  const [closed, setClosed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (
    hidden ||
    closed ||
    dismissedBefore ||
    installInviteFirst ||
    playerOpen ||
    support !== "supported" ||
    (status !== "off" && status !== "denied")
  ) {
    return null;
  }

  function close() {
    dismissPushInvite();
    setClosed(true);
  }

  async function enable() {
    setBusy(true);
    try {
      if (await pushClient.enable()) {
        setStatus("on");
        showSuccess("Pronto! Este aparelho vai receber os avisos.");
      } else {
        setStatus("denied");
      }
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : cause instanceof Error && cause.message === "push-disabled"
            ? "As notificações no celular ainda não foram configuradas no servidor."
            : "Não foi possível ativar. Tente em Configurações › Aplicativo.",
      );
      setClosed(true);
    }
    setBusy(false);
  }

  const blocked = status === "denied";

  return (
    <aside
      aria-label="Ativar notificações"
      className="sticky bottom-4 z-40 mx-4 mb-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:fixed sm:right-6 sm:bottom-6 sm:mx-0 sm:mb-0 sm:w-80"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
          <BellRing className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">
            {blocked
              ? "As notificações estão bloqueadas"
              : "Ative as notificações"}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {blocked
              ? "Para receber escalas, lembretes e comunicados, libere nas configurações do aparelho:"
              : "Receba escalas, lembretes e comunicados no celular, mesmo com o app fechado."}
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      {blocked && (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13px] text-muted">
          <li>
            App instalado: segure o ícone do PM SHOW › Informações do app ›
            Notificações › Permitir.
          </li>
          <li>
            No navegador: toque no cadeado ao lado do endereço › Permissões ›
            Notificações › Permitir.
          </li>
        </ol>
      )}

      <div className="mt-3 flex gap-2">
        <Button size="sm" className="flex-1" onClick={enable} loading={busy}>
          {blocked ? "Já liberei" : "Ativar"}
        </Button>
        <Button variant="ghost" size="sm" onClick={close} disabled={busy}>
          Agora não
        </Button>
      </div>
    </aside>
  );
}
