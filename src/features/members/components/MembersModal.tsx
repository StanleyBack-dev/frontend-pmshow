"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Users } from "lucide-react";
import { Badge, Modal, Spinner } from "@/design-system";
import { RankBadge } from "@/features/members/components/RankBadge";
import {
  SECTION_LABELS,
  STATUS_LABELS,
} from "@/features/members/model/member-labels";
import {
  DetailsList,
  DetailsToggle,
  phoneValue,
  registrationValue,
} from "@/features/rosters/components/MemberDetails";
import type { RosterEntry } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Who plays an instrument (or has a function): war name and full name per
// line, the chevron opens the musician's details.
export function MembersModal({
  title,
  empty,
  load,
  instrumentId,
  onClose,
}: {
  title: string;
  /** Text when nobody matches. */
  empty: string;
  /** Fetches the members (called once, when the modal opens). */
  load: () => Promise<RosterEntry[]>;
  /** Marks whose main instrument this is. */
  instrumentId?: string;
  onClose: () => void;
}) {
  const { showError } = useToast();
  const [members, setMembers] = useState<RosterEntry[] | null>(null);

  useEffect(() => {
    let active = true;
    load().then(
      (result) => {
        if (active) setMembers(result);
      },
      (cause: unknown) => {
        if (!active) return;
        showError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar os músicos.",
        );
        onClose();
      },
    );
    return () => {
      active = false;
    };
    // Loaded once per opening (the parent remounts it for another row).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      icon={<Users className="size-5" />}
      title={title}
    >
      {members === null ? (
        <div className="grid place-items-center py-10">
          <Spinner />
        </div>
      ) : members.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {members.map((member) => (
            <MemberLine
              key={member.userId}
              member={member}
              instrumentId={instrumentId}
            />
          ))}
        </ul>
      )}
    </Modal>
  );
}

function MemberLine({
  member,
  instrumentId,
}: {
  member: RosterEntry;
  instrumentId?: string;
}) {
  const [open, setOpen] = useState(false);
  const profile = member.profile;
  const title = profile?.warName ?? member.name;
  const primary = profile?.instruments.find(
    (item) => item.instrumentId === instrumentId,
  )?.primary;

  const details: [string, ReactNode][] = profile
    ? [
        ["Nome completo", member.name],
        ["Nome de guerra", profile.warName],
        ["Posto/graduação", <RankBadge key="rank" rank={profile.rank} />],
        ["Naipe", SECTION_LABELS[profile.section]],
        [
          "Instrumentos",
          profile.instruments
            .map((item) =>
              item.primary ? `${item.name} (principal)` : item.name,
            )
            .join(", ") || "—",
        ],
        [
          "Funções",
          profile.functions.map((item) => item.name).join(", ") || "—",
        ],
        ["Matrícula", registrationValue(profile.registration)],
        ["Telefone", phoneValue(profile.phone)],
        ["Situação", STATUS_LABELS[profile.status]],
      ]
    : [];

  return (
    <li className="px-3 py-2.5 text-sm">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-fg">{title}</span>
          <span className="block text-xs text-soft">
            {member.name}
            {!member.active && " · acesso desativado"}
          </span>
        </span>
        {primary && <Badge tone="accent">Principal</Badge>}
        <DetailsToggle
          open={open}
          name={title}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && <DetailsList items={details} className="mt-2" />}
    </li>
  );
}
