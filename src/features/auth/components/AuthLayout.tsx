import type { ReactNode } from "react";
import { Card } from "@/design-system";
import { Logo } from "@/features/layout/components/Logo";

// Frame of the signed-out pages (login, recovery, first access).
export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-2 text-sm text-muted">
            Banda da Polícia Militar de Goiás
          </p>
        </div>
        <Card className="p-6">
          <h1 className="text-lg font-semibold text-fg">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
          <div className="mt-5">{children}</div>
        </Card>
        <p className="mt-6 text-center text-xs text-soft">
          Acesso restrito aos integrantes da banda.
        </p>
      </div>
    </main>
  );
}
