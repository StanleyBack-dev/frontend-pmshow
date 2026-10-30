import { LogoMark } from "@/features/layout/components/LogoMark";

// For light backgrounds; the dark chrome draws its own (AppShell, AuthLayout).
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const mark = size === "lg" ? "size-9" : "size-8";
  const text = size === "lg" ? "text-lg" : "text-[15px]";
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={mark} />
      <span className={`${text} font-semibold tracking-tight text-fg`}>
        PM <span className="text-brand-gold-ink">SHOW</span>
      </span>
    </span>
  );
}
