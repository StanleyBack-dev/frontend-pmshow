"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleUserRound,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Avatar, Button, cn, Modal, Spinner } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { authClient } from "@/features/auth/api/auth.client";
import { InstallAppInvite } from "@/features/install/components/InstallAppInvite";
import { LogoMark } from "@/features/layout/components/LogoMark";
import { MenuSearch } from "@/features/layout/components/MenuSearch";
import {
  ACCOUNT_NAV,
  ADMIN_NAV,
  canSee,
  isActive,
  PRIMARY_NAV,
  type NavItem,
} from "@/features/layout/model/navigation";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import type { SessionUser } from "@/shared/contracts/api";

// The collapsed state is a per-browser preference. It lives in localStorage
// (read through an external store so the server render stays expanded).
const COLLAPSED_KEY = "pms:sidebar-collapsed";
const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(listener: () => void) {
  collapsedListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    collapsedListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    // Storage blocked: the toggle still works for this page via listeners.
  }
  collapsedListeners.forEach((listener) => listener());
}

function NavPendingHint() {
  const { pending } = useLinkStatus();
  return pending ? (
    <Spinner size="sm" className="ml-auto" label="Carregando página" />
  ) : null;
}

/** Only the first name: "Stanley Barbosa" → "Stanley". */
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  /** Icon rail (collapsed desktop sidebar). */
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const { href, label, icon: Icon } = item;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-md py-2 text-[13px] font-medium transition-colors",
        collapsed ? "px-3 lg:justify-center lg:px-0" : "px-3",
        active
          ? "bg-accent/90 text-chrome-fg"
          : "text-chrome-muted hover:bg-chrome-hover hover:text-chrome-fg",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-gold transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        aria-hidden
        className={cn(
          "size-[18px] shrink-0",
          active
            ? "text-brand-gold"
            : "text-chrome-subtle group-hover:text-brand-gold",
        )}
      />
      <span className={cn("flex-1 truncate", collapsed && "lg:sr-only")}>
        {label}
      </span>
      {!collapsed && <NavPendingHint />}
    </Link>
  );
}

// Signed-in frame (the amoremio layout): dark chrome sidebar with the main
// menu and a collapsible "Conta" section, an off-canvas drawer on phones,
// and a top bar over the light content with menu search and notifications.
export function AppShell({
  user,
  showAdmin,
  unreadNotifications,
  bottomBar,
  children,
}: {
  user: Pick<SessionUser, "name" | "group" | "permissions" | "photoUrl">;
  showAdmin: boolean;
  /** Server-side count; the bell keeps it fresh afterwards. */
  unreadNotifications: number;
  /** Bar pinned to the bottom of the content column (the audio player). */
  bottomBar?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  );

  const primary = PRIMARY_NAV.filter((item) => canSee(item, user.permissions));
  const account = showAdmin ? [...ACCOUNT_NAV, ADMIN_NAV] : ACCOUNT_NAV;
  const accountActive = account.some((item) => isActive(pathname, item));

  // Pin the page behind the open mobile drawer: on iOS only `position:
  // fixed` stops touch scrolling from reaching the page.
  useEffect(() => {
    if (!mobileOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  function openLogout() {
    closeMobile();
    setLogoutOpen(true);
  }

  async function logout() {
    setLeaving(true);
    await authClient.logout().catch(() => undefined);
    router.replace("/entrar");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-bg">
      <div
        aria-hidden
        onClick={closeMobile}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="Menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 max-w-[85vw] flex-col border-r border-chrome-line",
          "bg-linear-to-b from-chrome-top via-chrome to-chrome-bottom",
          "transition-[transform,width] duration-200 lg:max-w-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-[68px]" : "lg:w-64",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b border-chrome-line px-4 py-4",
            collapsed && "lg:flex-col lg:gap-2 lg:px-2",
          )}
        >
          <Link
            href="/inicio"
            onClick={closeMobile}
            className="flex min-w-0 flex-1 items-center gap-3"
            aria-label="PM SHOW, início"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-gold/40 bg-chrome-hover">
              <LogoMark className="size-7 text-chrome-fg" />
            </span>
            <span className={cn("min-w-0", collapsed && "lg:hidden")}>
              <span className="block text-[17px] leading-tight font-semibold tracking-wide text-chrome-fg">
                PM <span className="text-brand-gold">SHOW</span>
              </span>
              <span className="block truncate text-[10px] tracking-[0.16em] text-brand-gold uppercase">
                {firstName(user.name)}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => writeCollapsed(!collapsed)}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
            className="hidden size-8 shrink-0 place-items-center rounded-md text-chrome-subtle transition-colors hover:bg-chrome-hover hover:text-chrome-fg lg:grid"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-[18px]" aria-hidden />
            ) : (
              <PanelLeftClose className="size-[18px]" aria-hidden />
            )}
          </button>
        </div>

        {/* min-h-0 lets the menu scroll inside the space the footer leaves. */}
        <nav
          aria-label="Principal"
          className={cn(
            "chrome-scrollbar flex min-h-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto overscroll-contain py-4",
            collapsed ? "px-3 lg:px-2" : "px-3",
          )}
        >
          {primary.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item)}
              collapsed={collapsed}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        <div
          className={cn(
            "shrink-0 border-t border-chrome-line py-3",
            collapsed ? "px-3 lg:px-2" : "px-3",
          )}
        >
          {/* Icon rail: no room for a sub-menu, so the items show directly. */}
          {collapsed && (
            <div className="hidden lg:block">
              {account.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(pathname, item)}
                  collapsed
                  onNavigate={closeMobile}
                />
              ))}
            </div>
          )}
          <div className={cn(collapsed && "lg:hidden")}>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-expanded={accountOpen}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                accountActive && !accountOpen
                  ? "text-chrome-fg"
                  : "text-chrome-muted hover:bg-chrome-hover hover:text-chrome-fg",
              )}
            >
              {user.photoUrl ? (
                <Avatar
                  name={user.name}
                  src={user.photoUrl}
                  size="sm"
                  className="size-6 ring-1 ring-chrome-line"
                />
              ) : (
                <CircleUserRound
                  aria-hidden
                  className="size-[18px] text-chrome-subtle"
                />
              )}
              <span className="min-w-0 flex-1 text-left">
                <span className="block">Conta</span>
                <span className="block truncate text-[11px] font-normal text-chrome-subtle">
                  {GROUP_LABELS[user.group]}
                </span>
              </span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-4 transition-transform",
                  accountOpen && "rotate-180",
                )}
              />
            </button>
            {accountOpen && (
              <div className="mt-0.5 flex flex-col gap-0.5 border-l border-chrome-line pl-3">
                {account.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isActive(pathname, item)}
                    collapsed={false}
                    onNavigate={closeMobile}
                  />
                ))}
                <button
                  type="button"
                  onClick={openLogout}
                  className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-chrome-muted transition-colors hover:bg-chrome-hover hover:text-chrome-fg"
                >
                  <LogOut
                    aria-hidden
                    className="size-[18px] shrink-0 text-chrome-subtle group-hover:text-brand-gold"
                  />
                  <span className="flex-1 text-left">Sair</span>
                </button>
              </div>
            )}
          </div>

          {/* The icon rail hides the "Conta" section: Sair stays reachable. */}
          {collapsed && (
            <button
              type="button"
              onClick={openLogout}
              title="Sair"
              aria-label="Sair"
              className="mt-0.5 hidden w-full items-center justify-center rounded-md py-2 text-chrome-muted transition-colors hover:bg-chrome-hover hover:text-chrome-fg lg:flex"
            >
              <LogOut aria-hidden className="size-[18px] shrink-0" />
            </button>
          )}
        </div>
      </aside>

      <div
        className={cn(
          "flex min-h-dvh min-w-0 flex-col transition-[margin] duration-200",
          collapsed ? "lg:ml-[68px]" : "lg:ml-64",
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            className="grid size-9 shrink-0 place-items-center rounded-md border border-border-strong bg-surface text-muted hover:text-fg lg:hidden"
          >
            <Menu className="size-[18px]" aria-hidden />
          </button>
          <MenuSearch
            items={[...primary, ...account]}
            className="min-w-0 flex-1 sm:max-w-xs"
          />
          <div className="ml-auto flex items-center gap-1">
            <NotificationBell initialCount={unreadNotifications} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
        {bottomBar}
        {/* Inside the column: on phones it takes room at the end of the page
            instead of covering the last items. */}
        <InstallAppInvite />
      </div>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Encerrar sessão"
        icon={<LogOut className="size-5" />}
        busy={leaving}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setLogoutOpen(false)}
              disabled={leaving}
            >
              Cancelar
            </Button>
            <Button onClick={logout} loading={leaving}>
              Sair
            </Button>
          </>
        }
      >
        Você tem certeza que deseja sair do PM SHOW?
      </Modal>
    </div>
  );
}
