"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  LockOpen,
  LogOut,
  Power,
  PowerOff,
  type LucideIcon,
} from "lucide-react";
import { Button, Modal } from "@/design-system";
import {
  adminClient,
  type AccountAction,
} from "@/features/admin/api/admin.client";
import { TemporaryAccessPanel } from "@/features/admin/components/TemporaryAccessPanel";
import type { TemporaryAccess, UserAccount } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type ActionKey = AccountAction | "reset-password";

type ActionSpec = {
  label: string;
  icon: LucideIcon;
  danger?: boolean;
  confirm: string;
};

const ACTIONS: Record<ActionKey, ActionSpec> = {
  "reset-password": {
    label: "Redefinir senha",
    icon: KeyRound,
    confirm:
      "Gera uma nova senha temporária, encerra as sessões do usuário e envia o novo acesso por e-mail.",
  },
  unlock: {
    label: "Desbloquear",
    icon: LockOpen,
    confirm: "Libera o login antes do fim do bloqueio por tentativas.",
  },
  "revoke-sessions": {
    label: "Encerrar sessões",
    icon: LogOut,
    confirm: "Desconecta o usuário de todos os aparelhos.",
  },
  deactivate: {
    label: "Desativar acesso",
    icon: PowerOff,
    danger: true,
    confirm:
      "O usuário não consegue mais entrar e as sessões abertas são encerradas. Os dados e o histórico continuam guardados.",
  },
  activate: {
    label: "Reativar acesso",
    icon: Power,
    confirm: "O usuário volta a poder entrar com a senha atual.",
  },
};

export function UserAccountActions({ user }: { user: UserAccount }) {
  const router = useRouter();
  const [selected, setSelected] = useState<ActionKey | null>(null);
  const [result, setResult] = useState<TemporaryAccess | null>(null);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  const available: ActionKey[] = [
    "reset-password",
    ...(user.locked ? (["unlock"] as const) : []),
    "revoke-sessions",
    user.active ? "deactivate" : "activate",
  ];

  function close() {
    setSelected(null);
    setResult(null);
  }

  async function run() {
    if (!selected) return;
    setPending(true);
    try {
      if (selected === "reset-password") {
        setResult(await adminClient.resetPassword(user.id));
      } else {
        await adminClient.runAction(user.id, selected);
        close();
      }
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível concluir a ação.",
      );
    }
    setPending(false);
  }

  const spec = selected ? ACTIONS[selected] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {available.map((key) => {
          const { label, icon: Icon, danger } = ACTIONS[key];
          return (
            <Button
              key={key}
              variant={danger ? "danger" : "secondary"}
              size="sm"
              icon={<Icon className="size-4" />}
              onClick={() => setSelected(key)}
            >
              {label}
            </Button>
          );
        })}
      </div>

      <Modal
        open={spec !== null}
        onClose={close}
        title={result ? "Nova senha temporária" : (spec?.label ?? "")}
        tone={spec?.danger ? "danger" : "neutral"}
        busy={pending}
        footer={
          result ? (
            <Button onClick={close}>Concluir</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={close} disabled={pending}>
                Cancelar
              </Button>
              <Button
                variant={spec?.danger ? "danger" : "primary"}
                onClick={run}
                loading={pending}
              >
                Confirmar
              </Button>
            </>
          )
        }
      >
        {result ? (
          <TemporaryAccessPanel access={result} />
        ) : (
          <div className="space-y-3">
            <p>{spec?.confirm}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
