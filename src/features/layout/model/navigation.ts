import {
  Bell,
  CalendarDays,
  CalendarOff,
  CircleUserRound,
  ClipboardList,
  House,
  ListMusic,
  type LucideIcon,
  Megaphone,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Permission } from "@/shared/contracts/api";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Other paths that belong to this entry (pages under its tabs). */
  also?: string[];
  /** Shown only with this permission (the page and the API check again). */
  permission?: Permission;
};

// Main menu, in the order of a musician's routine. Each page checks its own
// permission again; the menu only hides what the user can't open.
export const PRIMARY_NAV: NavItem[] = [
  { href: "/inicio", label: "Início", icon: House },
  {
    href: "/agenda",
    label: "Agenda",
    icon: CalendarDays,
    permission: "EVENTS_READ",
  },
  {
    href: "/escalas",
    label: "Minhas escalas",
    icon: ClipboardList,
    permission: "ROSTERS_READ_OWN",
  },
  {
    href: "/repertorio",
    label: "Repertório",
    icon: ListMusic,
    permission: "REPERTOIRE_READ",
  },
  {
    href: "/musicos",
    label: "Músicos",
    icon: Users,
    permission: "MEMBERS_READ",
  },
  {
    href: "/indisponibilidades",
    label: "Indisponibilidades",
    icon: CalendarOff,
    permission: "ABSENCES_REQUEST",
  },
  {
    href: "/comunicados",
    label: "Comunicados",
    icon: Megaphone,
    permission: "NOTIFICATIONS_BROADCAST",
  },
];

// Inside the collapsible "Conta" section at the bottom of the sidebar.
export const ACCOUNT_NAV: NavItem[] = [
  { href: "/perfil", label: "Meu perfil", icon: CircleUserRound },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

/** Admin area: shown when the user has any of its permissions. */
export const ADMIN_NAV: NavItem = {
  href: "/admin",
  label: "Administração",
  icon: ShieldCheck,
};

export function isActive(pathname: string, item: NavItem): boolean {
  return [item.href, ...(item.also ?? [])].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
