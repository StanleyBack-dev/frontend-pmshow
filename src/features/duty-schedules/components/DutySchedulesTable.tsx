"use client";

import { useCallback, useState } from "react";
import { Eye } from "lucide-react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { DutyScheduleModal } from "@/features/duty-schedules/components/DutyScheduleModal";
import {
  DUTY_STATUS,
  audienceText,
  periodText,
} from "@/features/duty-schedules/model/duty-labels";
import type { DutySchedule } from "@/shared/contracts/duty-schedules";

// Expedientes launched (amoremio table): the eye opens the days and people
// (and the cancel button). On phones: title and period on the card.
export function DutySchedulesTable({
  schedules,
  canCancel,
}: {
  schedules: DutySchedule[];
  canCancel: boolean;
}) {
  const [opened, setOpened] = useState<string | null>(null);
  const close = useCallback(() => setOpened(null), []);
  const audit = auditColumn((schedule: DutySchedule) => ({
    entity: "duty_schedule" as const,
    id: schedule.id,
    label: schedule.title,
  }));

  const columns: DataTableColumn<DutySchedule>[] = [
    {
      key: "open",
      label: "",
      className: "w-12 pr-0",
      mobile: "control",
      render: (schedule) => (
        <button
          type="button"
          onClick={() => setOpened(schedule.id)}
          aria-label={`Ver ${schedule.title}`}
          title="Ver dias e escalados"
          className="grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
        >
          <Eye aria-hidden className="size-4" />
        </button>
      ),
    },
    {
      key: "title",
      label: "Expediente",
      mobile: "title",
      render: (schedule) => (
        <span className="font-medium text-fg">{schedule.title}</span>
      ),
    },
    {
      key: "period",
      label: "Período",
      className: "whitespace-nowrap",
      mobile: "subtitle",
      render: (schedule) => periodText(schedule.startsOn, schedule.endsOn),
    },
    {
      key: "days",
      label: "Dias",
      className: "tabular-nums",
      render: (schedule) => schedule.dayCount,
    },
    {
      key: "audience",
      label: "Para quem",
      render: (schedule) => audienceText(schedule),
    },
    {
      key: "people",
      label: "Pessoas",
      className: "tabular-nums",
      render: (schedule) => schedule.memberCount,
    },
    {
      key: "status",
      label: "Situação",
      className: "w-28",
      render: (schedule) => (
        <Badge tone={DUTY_STATUS[schedule.status].tone}>
          {DUTY_STATUS[schedule.status].label}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <DataTable
        rows={schedules}
        columns={[...columns, audit.column]}
        getId={(schedule) => schedule.id}
        renderExpanded={audit.renderExpanded}
      />
      {opened && (
        <DutyScheduleModal id={opened} canCancel={canCancel} onClose={close} />
      )}
    </>
  );
}
