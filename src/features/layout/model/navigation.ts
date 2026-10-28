import {
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  CircleUserRound,
  ClipboardList,
  Guitar,
  House,
  ListMusic,
  MapPin,
  type LucideIcon,
  Megaphone,
  MicVocal,
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
  /** Shown with any of these permissions. */
  anyPermission?: Permission[];
};

/** Whether the menu shows the entry to someone with `permissions`. */
export const canSee = (item: NavItem, permissions: readonly Permission[]) =>
  (!item.permission || permissions.includes(item.permission)) &&
  (!item.anyPermission ||
    item.anyPermission.some((permission) => permissions.includes(permission)));

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
    href: "/eventos",
    label: "Eventos",
    icon: CalendarClock,
    permission: "EVENTS_READ",
  },
  {
    href: "/locais",
    label: "Locais",
    icon: MapPin,
    permission: "EVENTS_MANAGE",
  },
  {
    href: "/escalas",
    label: "Escalas",
    icon: ClipboardList,
    permission: "ROSTERS_READ_OWN",
  },
  {
    href: "/expedientes",
    label: "Expedientes",
    icon: CalendarRange,
    permission: "ROSTERS_READ_OWN",
  },
  {
    href: "/repertorio",
    label: "Repertório",
    icon: ListMusic,
    permission: "REPERTOIRE_READ",
  },
  {
    href: "/cantores",
    label: "Cantores e bandas",
    icon: MicVocal,
    permission: "REPERTOIRE_READ",
  },
  {
    href: "/musicos",
    label: "Músicos",
    icon: Users,
    permission: "MEMBERS_READ",
  },
  {
    href: "/instrumentos",
    label: "Instrumentos",
    icon: Guitar,
    permission: "MEMBERS_MANAGE",
  },
  {
    href: "/funcoes",
    label: "Funções",
    icon: BriefcaseBusiness,
    permission: "MEMBERS_MANAGE",
  },
  {
    href: "/indisponibilidades",
    label: "Indisponibilidades",
    icon: CalendarOff,
    // Musicians ask; managers review.
    anyPermission: ["ABSENCES_REQUEST", "ABSENCES_MANAGE"],
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
