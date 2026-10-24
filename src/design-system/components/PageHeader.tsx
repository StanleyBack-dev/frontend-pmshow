import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-fg sm:text-[22px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[13px] text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
