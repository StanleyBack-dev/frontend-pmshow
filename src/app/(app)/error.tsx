"use client";

import { useEffect } from "react";
import { ServerCrash } from "lucide-react";
import { Button, Card, EmptyState } from "@/design-system";
import { apiRequest } from "@/shared/lib/api-client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    // Into Administração → Logs; a failure to report is not shown.
    apiRequest("/client-errors", {
      method: "POST",
      body: JSON.stringify({
        message: (error.message || "Erro sem mensagem").slice(0, 1000),
        url: window.location.pathname.slice(0, 300),
        digest: error.digest ?? null,
      }),
    }).catch(() => undefined);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon={<ServerCrash className="size-5" />}
        title="Não foi possível carregar os dados"
        description="O servidor pode estar indisponível. Tente novamente em instantes."
        action={
          <Button variant="secondary" onClick={reset}>
            Tentar novamente
          </Button>
        }
      />
    </Card>
  );
}
