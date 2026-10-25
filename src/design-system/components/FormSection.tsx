import type { ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

// A titled group of fields inside a form (drawer): icon, title, one line of
// help, then the fields. Long forms read as a few small steps.
export function FormSection({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-3 border-t border-border pt-5 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <header className="flex items-start gap-2.5">
        {icon && (
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent [&>svg]:size-4"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-fg">{title}</h3>
          {description && (
            <p className="text-xs leading-snug text-soft">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}
