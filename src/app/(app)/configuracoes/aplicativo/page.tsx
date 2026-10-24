import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/design-system";
import { InstallAppCard } from "@/features/install/components/InstallAppCard";
import { PushNotificationsCard } from "@/features/notifications/components/PushNotificationsCard";

export const metadata: Metadata = { title: "Aplicativo no celular" };

// The app on this device: install it (PWA) and turn on its notifications.
// Both are per device, so this page is about the one in hand.
export default function AppSettingsPage() {
  return (
    <>
      <Link
        href="/configuracoes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Configurações
      </Link>
      <PageHeader
        title="Aplicativo no celular"
        description="Cada aparelho é configurado separadamente: faça isto em cada celular ou computador que você usa."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <InstallAppCard />
        <PushNotificationsCard />
      </div>
    </>
  );
}
