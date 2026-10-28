"use client";

import { useState, type ReactNode } from "react";
import { Avatar, Badge, cn } from "@/design-system";
import { RankBadge } from "@/features/members/components/RankBadge";
import { SECTION_LABELS } from "@/features/members/model/member-labels";
import {
  DetailsList,
  DetailsToggle,
  personTitle,
  phoneValue,
  registrationValue,
} from "@/features/rosters/components/MemberDetails";
import {
  ACK_STATUS,
  MUSICIAN_FUNCTION,
  lineRole,
  sortedLines,
} from "@/features/rosters/model/roster-labels";
import type { Assignment, Roster } from "@/shared/contracts/rosters";

// Read-only roster: who goes, in which function, and each person's answer; the
// chevron opens the musician's details. Managers also see contact data and
// the justifications for accepted schedule conflicts.
export function RosterList({
  roster,
  viewerId,
  showManagerInfo,
}: {
  roster: Roster;
  viewerId: string;
  showManagerInfo: boolean;
}) {
  const lines = sortedLines(roster);
  const answered = lines.filter((line) => line.ackStatus === "CIENTE").length;

  return (
    <div className="space-y-3">
      {roster.status === "PUBLICADA" && (
        <p className="text-sm text-muted">
          {answered} de {lines.length} ciente{lines.length === 1 ? "" : "s"}.
        </p>
      )}
      {showManagerInfo && roster.uncoveredSections.length > 0 && (
        <p className="text-sm text-warning">
          Sem ninguém escalado:{" "}
          {roster.uncoveredSections.map((s) => SECTION_LABELS[s]).join(", ")}.
        </p>
      )}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {lines.map((line) => (
          <RosterLine
            key={line.userId}
            line={line}
            published={roster.status === "PUBLICADA"}
            mine={line.userId === viewerId}
            showManagerInfo={showManagerInfo}
          />
        ))}
      </ul>
    </div>
  );
}

function RosterLine({
  line,
  published,
  mine,
  showManagerInfo,
}: {
  line: Assignment;
  published: boolean;
  mine: boolean;
  showManagerInfo: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ack = ACK_STATUS[line.ackStatus];
  const person = line.person;
  const name = person
    ? personTitle(person.rank, person.name)
    : "Conta desativada";
  const role = lineRole(line.functionName, line.instrumentName);

  const details: [string, ReactNode][] = person
    ? [
        ["Nome de guerra", person.warName],
        ["Posto/graduação", <RankBadge key="rank" rank={person.rank} />],
        ["Naipe", SECTION_LABELS[person.section]],
        ["Função", line.functionName ?? MUSICIAN_FUNCTION],
        ["Instrumento", line.instrumentName ?? "—"],
        ...(showManagerInfo
          ? ([
              ["Matrícula", registrationValue(person.registration)],
              ["Telefone", phoneValue(person.phone)],
            ] as [string, ReactNode][])
          : []),
      ]
    : [];

  return (
    <li className={cn("px-3 py-2.5 text-sm", mine && "bg-accent-soft/40")}>
      <div className="flex items-center gap-x-3 gap-y-1">
        <Avatar
          name={person?.warName ?? name}
          src={person?.photoUrl ?? null}
          size="sm"
        />
        <span className="min-w-0 flex-1">
          <span className="font-medium text-fg">{name}</span>
          <span className="block text-xs text-soft">{role}</span>
        </span>
        {published && <Badge tone={ack.tone}>{ack.label}</Badge>}
        {person && (
          <DetailsToggle
            open={open}
            name={name}
            onClick={() => setOpen(!open)}
          />
        )}
      </div>
      {open && <DetailsList items={details} className="mt-2" />}
      {line.notes && <p className="mt-1 text-xs text-muted">{line.notes}</p>}
      {line.ackStatus === "TROCA_SOLICITADA" && line.ackNote && (
        <p className="mt-1 text-xs text-danger">
          Motivo da troca: {line.ackNote}
        </p>
      )}
      {showManagerInfo && line.overrideReason && (
        <p className="mt-1 text-xs text-warning">
          Conflito de horário aceito: {line.overrideReason}
        </p>
      )}
    </li>
  );
}
