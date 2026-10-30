"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CalendarPlus, Smartphone, X } from "lucide-react";
import { Button, buttonClasses, cn } from "@/design-system";
import {
  useInstallInviteOpen,
  useInstallState,
} from "@/features/install/model/install-store";
import { usePushInvitePending } from "@/features/notifications/model/push-status";
import { usePlayer } from "@/features/player/components/PlayerProvider";
import type { CalendarFeedLinks } from "@/shared/contracts/calendar";
import { apiRequest, ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

const noopSubscribe = () => () => {};

// Answered ("Agora não" or a calendar chosen): asked again only after a
// month, on this browser. Once the link exists it is never offered again.
const DISMISSED_KEY = "pms:calendar-invite-dismissed-at";
const ASK_AGAIN_MS = 30 * 24 * 60 * 60 * 1000;

function wasDismissed(): boolean {
  try {
    const at = Number(window.localStorage.getItem(DISMISSED_KEY));
    return at > 0 && Date.now() - at < ASK_AGAIN_MS;
  } catch {
    return true;
  }
}

function dismiss() {
  try {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Nothing to remember it with.
  }
}

// Invitation to see the rosters and working days in the phone's calendar,
// after signing in, for who has no agenda link yet (the same link as
// Configurações › Agenda no celular). Two steps: "Sincronizar" creates the
// link, then the calendar is chosen (browsers only open Google Calendar
// straight from a tap). Waits for the install and notifications invites,
// one card at a time, and steps aside while the player is open.
export function CalendarSyncInvite({ hidden }: { hidden: boolean }) {
  const { ios } = useInstallState();
  const installFirst = useInstallInviteOpen();
  const pushFirst = usePushInvitePending();
  const playerOpen = Boolean(usePlayer().current);
  const { showError } = useToast();
  // Read on the client only (the server render never shows the invite).
  const dismissedBefore = useSyncExternalStore(
    noopSubscribe,
    wasDismissed,
    () => true,
  );
  const waiting =
    hidden || dismissedBefore || installFirst || pushFirst || playerOpen;
  // undefined: not asked yet; null: no link yet (the invite shows).
  const [existing, setExisting] = useState<CalendarFeedLinks | null>();
  const [links, setLinks] = useState<CalendarFeedLinks | null>(null);
  const [closed, setClosed] = useState(false);
  const [busy, setBusy] = useState(false);

  // Asked only when it could show, once.
  useEffect(() => {
    if (waiting || existing !== undefined) return;
    let active = true;
    apiRequest<CalendarFeedLinks | null>("/me/calendar").then(
      (found) => active && setExisting(found),
      () => undefined, // stay quiet: the option is in the settings
    );
    return () => {
      active = false;
    };
  }, [waiting, existing]);

  if (waiting || closed || existing !== null) return null;

  function close() {
    dismiss();
    setClosed(true);
  }

  async function create() {
    setBusy(true);
    try {
      setLinks(
        await apiRequest<CalendarFeedLinks>("/me/calendar", { method: "POST" }),
      );
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível criar o link da agenda.",
      );
    }
    setBusy(false);
  }

  return (
    <aside
      aria-label="Sincronizar com a agenda do celular"
      className="sticky bottom-4 z-40 mx-4 mb-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:fixed sm:right-6 sm:bottom-6 sm:mx-0 sm:mb-0 sm:w-80"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
          <CalendarPlus className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">
            {links ? "Escolha a sua agenda" : "Suas escalas na sua agenda"}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {links
              ? "Confirme a assinatura na agenda que abrir. As mudanças chegam sozinhas."
              : "Veja os eventos em que você está escalado e os seus expedientes no Google Agenda ou no iPhone."}
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

      {links ? (
        // The phone's own calendar first on iPhones.
        <div
          className={cn(
            "mt-3 flex gap-2",
            ios ? "flex-col-reverse" : "flex-col",
          )}
        >
          <a
            href={links.google}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={buttonClasses(ios ? "secondary" : "primary", "sm")}
          >
            <CalendarPlus aria-hidden className="size-4" />
            Google Agenda
          </a>
          <a
            href={links.webcal}
            onClick={close}
            className={buttonClasses(ios ? "primary" : "secondary", "sm")}
          >
            <Smartphone aria-hidden className="size-4" />
            iPhone / Mac
          </a>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" onClick={create} loading={busy}>
            Sincronizar
          </Button>
          <Button variant="ghost" size="sm" onClick={close} disabled={busy}>
            Agora não
          </Button>
        </div>
      )}
      {links && (
        <Link
          href="/configuracoes/agenda"
          onClick={close}
          className="mt-2 block text-center text-xs text-soft underline-offset-2 hover:underline"
        >
          Outros apps e mais opções
        </Link>
      )}
    </aside>
  );
}
