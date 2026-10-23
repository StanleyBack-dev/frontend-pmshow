"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Alert, Button } from "@/design-system";
import type { TemporaryAccess } from "@/shared/contracts/api";

// The temporary password is shown once: the API keeps only its hash.
export function TemporaryAccessPanel({ access }: { access: TemporaryAccess }) {
  const [copied, setCopied] = useState(false);
  const text = `Usuário: ${access.user.username}\nSenha temporária: ${access.temporaryPassword}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <Alert tone={access.emailSent ? "success" : "warning"}>
        {access.emailSent
          ? `Enviamos o acesso para ${access.user.email}. Você também pode repassar os dados abaixo.`
          : "Não foi possível enviar o e-mail. Repasse os dados abaixo diretamente ao usuário."}
      </Alert>
      <dl className="rounded-lg border border-border bg-surface-muted p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Usuário</dt>
          <dd className="font-mono font-semibold text-fg">
            {access.user.username}
          </dd>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <dt className="text-muted">Senha temporária</dt>
          <dd className="font-mono text-base font-semibold tracking-wider text-fg">
            {access.temporaryPassword}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-soft">
        Esta senha não será exibida de novo. No primeiro acesso, o usuário cria
        a própria senha.
      </p>
      <Button
        variant="secondary"
        onClick={copy}
        icon={
          copied ? <Check className="size-4" /> : <Copy className="size-4" />
        }
      >
        {copied ? "Copiado" : "Copiar dados de acesso"}
      </Button>
    </div>
  );
}
