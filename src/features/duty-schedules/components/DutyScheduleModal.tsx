"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX, ClipboardList } from "lucide-react";
import { Badge, Button, Modal, Spinner, TextArea } from "@/design-system";
import { dutySchedulesClient } from "@/features/duty-schedules/api/duty-schedules.client";
import {
  DUTY_STATUS,
  audienceText,
  periodText,
} from "@/features/duty-schedules/model/duty-labels";
import {
  EVENT_STATUS,
  UNIFORM_LABELS,
} from "@/features/events/model/event-labels";
import { SECTION_LABELS } from "@/features/members/model/member-labels";
import type { DutyScheduleDetail } from "@/shared/contracts/duty-schedules";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatShortDay, formatTime } from "@/shared/lib/datetime";
import { useToast } from "@/shared/toast/useToast";

// An expediente in detail: its days (each opens the event) and its people;
// who manages can cancel the days still ahead.
export function DutyScheduleModal({
  id,
  canCancel,
  onClose,
}: {
  id: string;
  canCancel: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [schedule, setSchedule] = useState<DutyScheduleDetail | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    dutySchedulesClient.get(id).then(
      (result) => {
        if (active) setSchedule(result);
      },
      (cause: unknown) => {
        if (!active) return;
        showError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar o expediente.",
        );
        onClose();
      },
    );
    return () => {
      active = false;
    };
  }, [id, onClose, showError]);

  async function cancel() {
    setPending(true);
    try {
      await dutySchedulesClient.cancel(id, reason);
      showSuccess(
        "Expediente cancelado.",
        "Os dias que ainda não aconteceram foram cancelados e as pessoas avisadas.",
      );
      router.refresh();
      onClose();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível cancelar.",
      );
      setPending(false);
    }
  }

  const status = schedule ? DUTY_STATUS[schedule.status] : null;

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      busy={pending}
      icon={<ClipboardList className="size-5" />}
      title={schedule?.title ?? "Expediente"}
      footer={
        schedule && canCancel && schedule.status === "ATIVA" ? (
          cancelling ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setCancelling(false)}
                disabled={pending}
              >
                Voltar
              </Button>
              <Button
                variant="danger"
                onClick={cancel}
                loading={pending}
                disabled={!reason.trim()}
              >
                Cancelar expediente
              </Button>
            </>
          ) : (
            <Button
              variant="danger"
              icon={<CalendarX className="size-4" />}
              onClick={() => setCancelling(true)}
            >
              Cancelar expediente
            </Button>
          )
        ) : undefined
      }
    >
      {!schedule || !status ? (
        <div className="grid place-items-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-5">
          {cancelling && (
            <div className="space-y-2 rounded-lg border border-danger-border bg-danger-soft p-3">
              <p className="text-sm text-fg">
                Os dias que ainda não aconteceram são cancelados e cada pessoa
                recebe um aviso só.
              </p>
              <TextArea
                label="Motivo do cancelamento"
                required
                rows={2}
                maxLength={300}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Item label="Período">
              {periodText(schedule.startsOn, schedule.endsOn)}
            </Item>
            <Item label="Situação">
              <Badge tone={status.tone}>{status.label}</Badge>
            </Item>
            <Item label="Local">{schedule.venue?.name ?? "—"}</Item>
            <Item label="Uniforme">{UNIFORM_LABELS[schedule.uniform]}</Item>
            <Item label="Para quem">{audienceText(schedule)}</Item>
            <Item label="Pessoas">{schedule.memberCount}</Item>
            {schedule.notes && (
              <Item label="Observações" wide>
                <span className="whitespace-pre-line">{schedule.notes}</span>
              </Item>
            )}
            {schedule.cancellationReason && (
              <Item label="Motivo do cancelamento" wide>
                {schedule.cancellationReason}
              </Item>
            )}
          </dl>

          <section className="space-y-2">
            <h3 className="text-[13px] font-semibold text-fg">
              Dias ({schedule.days.length})
            </h3>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {schedule.days.map((day) => (
                <li key={day.id}>
                  <Link
                    href={`/eventos/${day.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-surface-muted"
                  >
                    <span className="w-28 shrink-0 font-medium text-fg first-letter:uppercase">
                      {formatShortDay(day.startsAt)}
                    </span>
                    <span className="flex-1 text-muted tabular-nums">
                      {formatTime(day.startsAt)}
                      {day.endsAt && ` às ${formatTime(day.endsAt)}`}
                    </span>
                    {day.status !== "CONFIRMADO" && (
                      <Badge tone={EVENT_STATUS[day.status].tone}>
                        {EVENT_STATUS[day.status].label}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-[13px] font-semibold text-fg">
              Escalados ({schedule.members.length})
            </h3>
            <ul className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
              {schedule.members.map((member) => (
                <li key={member.userId} className="min-w-0">
                  <span className="font-medium text-fg">
                    {member.profile?.warName ?? member.name}
                  </span>
                  {member.profile && (
                    <span className="text-xs text-soft">
                      {" "}
                      · {SECTION_LABELS[member.profile.section]}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
}

function Item({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold tracking-[0.05em] text-soft uppercase">
        {label}
      </dt>
      <dd className="text-fg">{children}</dd>
    </div>
  );
}
