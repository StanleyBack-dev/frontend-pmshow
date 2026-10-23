import Link from "next/link";
import { ShieldX } from "lucide-react";
import { buttonClasses, Card, EmptyState } from "@/design-system";

export function AccessDenied() {
  return (
    <Card>
      <EmptyState
        icon={<ShieldX className="size-5" />}
        title="Acesso não permitido"
        description="Você não tem permissão para ver esta página. Se precisar, fale com um gestor da banda."
        action={
          <Link href="/inicio" className={buttonClasses("secondary")}>
            Voltar ao início
          </Link>
        }
      />
    </Card>
  );
}
