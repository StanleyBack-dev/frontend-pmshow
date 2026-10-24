import { LogoMark } from "@/features/layout/components/LogoMark";

// Shown in the content area while a page waits for the server (route
// loading.tsx files). The menu has already moved to the new page; this tells
// the user the click worked. Fades in after a short delay so fast pages
// don't flash it.
export function PageLoading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[55vh] animate-fade-in-delayed flex-col items-center justify-center gap-4"
    >
      <span className="relative grid size-16 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-brand-gold-soft border-t-brand-gold"
        />
        <LogoMark className="size-8 text-accent" />
      </span>
      <p className="text-sm font-medium text-muted">{label}</p>
    </div>
  );
}
