"use client";

import { useState } from "react";
import { BellOff, BellRing, Send } from "lucide-react";
import { Alert, Button, Card, CardBody, CardHeader } from "@/design-system";
import { IosInstallSteps } from "@/features/install/components/IosInstallSteps";
import { pushClient } from "@/features/notifications/api/push.client";
import { usePushStatus } from "@/features/notifications/model/push-status";
import { ApiClientError } from "@/shared/lib/api-client";

// Notifications on this device (Web Push). Each phone or computer is turned
// on separately; the same notices still arrive in the app and by e-mail.
export function PushNotificationsCard() {
  const { support, status, setStatus } = usePushStatus();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "success" | "danger" | "info";
    text: string;
  } | null>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
    } catch (cause) {
      setMessage({
        tone: "danger",
        text:
          cause instanceof ApiClientError
            ? cause.message
            : cause instanceof Error && cause.message === "push-disabled"
              ? "As notificações no celular ainda não foram configuradas no servidor."
              : "Não foi possível. Tente de novo.",
      });
    }
    setBusy(false);
  }

  const enable = () =>
    run(async () => {
      const granted = await pushClient.enable();
      setStatus(granted ? "on" : "denied");
      if (granted) {
        setMessage({
          tone: "success",
          text: "Pronto! Este aparelho vai receber os avisos.",
        });
      }
    });

  const disable = () =>
    run(async () => {
      await pushClient.disable();
      setStatus("off");
    });

  const test = () =>
    run(async () => {
      const { devices } = await pushClient.test();
      setMessage({
        tone: devices > 0 ? "success" : "info",
        text:
          devices > 0
            ? `Enviado para ${devices} aparelho${devices === 1 ? "" : "s"}.`
            : "Nenhum aparelho recebeu. Ative de novo neste aparelho.",
      });
    });

  return (
    <Card>
      <CardHeader
        title="Notificações no aparelho"
        description="Receba escalas, lembretes e comunicados como notificação, mesmo com o app fechado."
      />
      <CardBody className="space-y-4">
        {message && <Alert tone={message.tone}>{message.text}</Alert>}
        {support === null ? null : support === "needs-install" ? (
          <div className="space-y-3 text-sm text-muted">
            <p>
              No iPhone, as notificações funcionam com o app instalado na tela
              de início. Instale e abra o PM SHOW por lá:
            </p>
            <IosInstallSteps />
          </div>
        ) : support === "unsupported" ? (
          <p className="text-sm text-muted">
            Este navegador não recebe notificações. Use o Chrome, o Edge, o
            Firefox ou o app instalado.
          </p>
        ) : status === "denied" ? (
          <p className="text-sm text-muted">
            As notificações estão bloqueadas para o PM SHOW neste navegador.
            Libere nas configurações do site e volte aqui.
          </p>
        ) : status === "on" ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              icon={<Send className="size-4" />}
              loading={busy}
              onClick={test}
            >
              Enviar teste
            </Button>
            <Button
              variant="ghost"
              icon={<BellOff className="size-4" />}
              disabled={busy}
              onClick={disable}
            >
              Desativar neste aparelho
            </Button>
          </div>
        ) : status === "off" ? (
          <Button
            icon={<BellRing className="size-4" />}
            loading={busy}
            onClick={enable}
          >
            Ativar neste aparelho
          </Button>
        ) : null}
      </CardBody>
    </Card>
  );
}
