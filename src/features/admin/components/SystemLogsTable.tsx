"use client";

import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  environmentLabel,
} from "@/features/admin/model/system-log-labels";
import type { SystemLog } from "@/shared/contracts/system-logs";
import { formatDateTime } from "@/shared/lib/datetime";

function LevelBadge({ log }: { log: SystemLog }) {
  const level = LEVEL_LABELS[log.level];
  return <Badge tone={level.tone}>{level.label}</Badge>;
}

// Everything else about the record: who, from where, how long, and the
// technical details (redacted by the API).
function LogDetails({ log }: { log: SystemLog }) {
  const facts = [
    { label: "Usuário", value: log.userName ?? "—" },
    { label: "IP", value: log.ip ?? "—" },
    {
      label: "Status HTTP",
      value: log.statusCode == null ? "—" : String(log.statusCode),
    },
    {
      label: "Duração",
      value: log.durationMs == null ? "—" : `${log.durationMs} ms`,
    },
    { label: "Ambiente", value: environmentLabel(log.environment) },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm whitespace-pre-wrap text-fg [overflow-wrap:anywhere]">
        {log.message}
      </p>
      <dl className="grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-3 lg:grid-cols-5">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-xs text-soft">{fact.label}</dt>
            <dd className="truncate text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {log.details && Object.keys(log.details).length > 0 && (
        <pre className="max-h-72 overflow-auto rounded-md border border-border bg-surface-muted p-3 text-xs leading-5 whitespace-pre-wrap break-all text-muted">
          {JSON.stringify(log.details, null, 2)}
        </pre>
      )}
    </div>
  );
}

const COLUMNS: DataTableColumn<SystemLog>[] = [
  {
    key: "createdAt",
    label: "Quando",
    mobile: "subtitle",
    className: "whitespace-nowrap tabular-nums",
    render: (log) => formatDateTime(log.createdAt),
  },
  {
    key: "level",
    label: "Nível",
    mobile: "control",
    render: (log) => <LevelBadge log={log} />,
  },
  {
    key: "category",
    label: "Tipo",
    mobile: "detail",
    className: "whitespace-nowrap",
    render: (log) => CATEGORY_LABELS[log.category] ?? log.category,
  },
  {
    key: "message",
    label: "Mensagem",
    mobile: "title",
    render: (log) => (
      <span className="line-clamp-2 [overflow-wrap:anywhere]">
        {log.message}
      </span>
    ),
  },
  {
    key: "source",
    label: "Origem",
    mobile: "detail",
    render: (log) => (
      <span className="line-clamp-2 text-muted [overflow-wrap:anywhere]">
        {log.source}
      </span>
    ),
  },
];

export function SystemLogsTable({ logs }: { logs: SystemLog[] }) {
  return (
    <DataTable
      rows={logs}
      columns={COLUMNS}
      getId={(log) => log.id}
      renderExpanded={(log) => <LogDetails log={log} />}
      renderDesktopExpanded={(log) => <LogDetails log={log} />}
    />
  );
}
