import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader, PageHeader } from "@/design-system";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";

export const metadata: Metadata = { title: "Trocar senha" };

export default function ChangePasswordPage() {
  return (
    <>
      <Link
        href="/configuracoes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Configurações
      </Link>
      <PageHeader
        title="Trocar senha"
        description="Ao trocar, você continua conectado só neste aparelho."
      />
      <Card>
        <CardHeader
          title="Senha de acesso"
          description="Informe a senha atual e escolha a nova. As sessões em outros aparelhos são encerradas."
        />
        <CardBody>
          <ChangePasswordForm wide />
        </CardBody>
      </Card>
    </>
  );
}
