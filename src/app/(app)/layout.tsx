import { redirect } from "next/navigation";
import { AppShell } from "@/features/layout/components/AppShell";
import { MiniPlayer } from "@/features/player/components/MiniPlayer";
import { PlayerProvider } from "@/features/player/components/PlayerProvider";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { notificationsService } from "@/server/services/notifications.service";
import { ADMIN_AREA_PERMISSIONS, canAny } from "@/shared/lib/access";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (user.mustChangePassword) redirect("/primeiro-acesso");
  const unread = await authed((token) =>
    notificationsService.unreadCount(token),
  );

  // The player wraps the whole signed-in area so audio keeps playing while
  // the user moves between pages.
  return (
    <PlayerProvider>
      <AppShell
        user={user}
        showAdmin={canAny(user, ...ADMIN_AREA_PERMISSIONS)}
        unreadNotifications={unread}
      >
        {children}
      </AppShell>
      <MiniPlayer />
    </PlayerProvider>
  );
}
