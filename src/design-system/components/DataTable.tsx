"use client";

import { Fragment, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/design-system/utils/cn";

export type DataTableColumn<T> = {
  key: string;
  /** Header text; empty for control columns (icon buttons). */
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
  /**
   * Place on phones (amoremio cards): "title" and "subtitle" make the card
   * header, "control" pins the cell next to them (play, edit…), "detail"
   * goes to the list revealed by the chevron (default), "hidden" is
   * desktop-only.
   */
  mobile?: "title" | "subtitle" | "control" | "detail" | "hidden";
};

// List table of the amoremio app: a table with a dark header on larger
// screens; on phones each row becomes a card whose chevron reveals every
// other column as label/value pairs, without opening a form. Rows are not
// clickable: actions are explicit buttons in control columns.
export function DataTable<T>({
  rows,
  columns,
  getId,
  renderExpanded,
  className,
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  getId: (row: T) => string;
  /** Extra content at the end of an expanded phone card (e.g. actions). */
  renderExpanded?: (row: T) => ReactNode;
  className?: string;
}) {
  const role = (column: DataTableColumn<T>) => column.mobile ?? "detail";
  const title = columns.find((column) => role(column) === "title");
  const subtitle = columns.find((column) => role(column) === "subtitle");
  const controls = columns.filter((column) => role(column) === "control");
  const details = columns.filter((column) => role(column) === "detail");

  return (
    <div className={className}>
      <ul className="flex flex-col gap-2 p-2 sm:hidden">
        {rows.map((row) => (
          <MobileCard
            key={getId(row)}
            row={row}
            title={title}
            subtitle={subtitle}
            controls={controls}
            details={details}
            renderExpanded={renderExpanded}
          />
        ))}
      </ul>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-chrome">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-2.5 text-left text-[11px] font-semibold tracking-[0.07em] whitespace-nowrap text-chrome-muted uppercase",
                    column.className,
                  )}
                >
                  {column.label ? (
                    column.label
                  ) : (
                    <span className="sr-only">Ações</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getId(row)}
                className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-muted/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-2.5 align-middle text-fg",
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MobileCard<T>({
  row,
  title,
  subtitle,
  controls,
  details,
  renderExpanded,
}: {
  row: T;
  title?: DataTableColumn<T>;
  subtitle?: DataTableColumn<T>;
  controls: DataTableColumn<T>[];
  details: DataTableColumn<T>[];
  renderExpanded?: (row: T) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const expandable = details.length > 0 || Boolean(renderExpanded);

  return (
    <li className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center gap-2 px-3 py-2.5">
        {expandable && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Recolher detalhes" : "Ver detalhes"}
            className="grid size-7 shrink-0 place-items-center rounded-md text-soft hover:bg-surface-muted hover:text-fg"
          >
            <ChevronRight
              aria-hidden
              className={cn("size-4 transition-transform", open && "rotate-90")}
            />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <div className="truncate text-[13px] font-medium text-fg">
              {title.render(row)}
            </div>
          )}
          {subtitle && (
            <div className="truncate text-xs text-soft">
              {subtitle.render(row)}
            </div>
          )}
        </div>
        {controls.length > 0 && (
          <div className="flex shrink-0 items-center gap-1">
            {controls.map((column) => (
              <Fragment key={column.key}>{column.render(row)}</Fragment>
            ))}
          </div>
        )}
      </div>
      {open && details.length > 0 && (
        <dl className="divide-y divide-border border-t border-border px-3">
          {details.map((column) => (
            <div
              key={column.key}
              className="flex items-baseline justify-between gap-3 py-2"
            >
              <dt className="shrink-0 text-[10px] font-medium tracking-wide text-soft uppercase">
                {column.label}
              </dt>
              <dd className="min-w-0 flex-1 text-right text-[13px] break-words text-fg">
                {column.render(row)}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {open && renderExpanded?.(row)}
    </li>
  );
}
