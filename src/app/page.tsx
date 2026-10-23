import { CircleCheck, CircleX } from "lucide-react";
import { Card } from "@/design-system";
import { Logo } from "@/features/layout/components/Logo";
import { healthService } from "@/server/services/health.service";

// Foundation page (phase 0): proves the BFF reaches the GraphQL API with its
// internal key. Replaced by the login flow in phase 1.
export const dynamic = "force-dynamic";

export default async function Home() {
  const health = await healthService.check();

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <Card className="w-full max-w-sm p-8 text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <p className="mt-3 text-sm text-muted">
          Banda da Polícia Militar de Goiás
        </p>
        <div
          className={
            health.ok
              ? "mt-8 flex items-center justify-center gap-2 rounded-md bg-success-soft px-3 py-2 text-sm text-success"
              : "mt-8 flex items-center justify-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
          }
          role="status"
        >
          {health.ok ? (
            <>
              <CircleCheck className="size-4" aria-hidden /> API conectada
            </>
          ) : (
            <>
              <CircleX className="size-4" aria-hidden />
              API indisponível ({health.code})
            </>
          )}
        </div>
      </Card>
    </main>
  );
}
