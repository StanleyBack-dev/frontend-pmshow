"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Megaphone, Save, Search } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Field,
  Modal,
  Select,
  cn,
  inputClasses,
} from "@/design-system";
import {
  RANK_LABELS,
  SECTIONS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import { rostersClient } from "@/features/rosters/api/rosters.client";
import {
  BLOCKER_LABELS,
  ROLES,
  ROLE_LABELS,
} from "@/features/rosters/model/roster-labels";
import {
  ABSENCE_TYPE_LABELS,
  formatPeriod,
} from "@/features/availability/model/absence-labels";
import type {
  AssignmentInput,
  AssignmentRole,
  Roster,
  RosterCandidate,
} from "@/shared/contracts/rosters";
import { ApiClientError } from "@/shared/lib/api-client";

type Line = Omit<AssignmentInput, "userId">;

const fromRoster = (roster: Roster | null): Record<string, Line> =>
  Object.fromEntries(
    (roster?.assignments ?? []).map((item) => [
      item.userId,
      {
        role: item.role,
        instrumentId: item.instrumentId,
        notes: item.notes,
        overrideReason: item.overrideReason,
      },
    ]),
  );

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// Building a roster: pick people by section, set role and instrument. People
// who can't go (inactive, away, approved absence) are shown but locked;
// someone on another event at the same time needs a justification.
export function RosterEditor({
  eventId,
  candidates,
  roster,
  canPublish,
}: {
  eventId: string;
  candidates: RosterCandidate[];
  roster: Roster | null;
  canPublish: boolean;
}) {
  const router = useRouter();
  const [lines, setLines] = useState<Record<string, Line>>(() =>
    fromRoster(roster),
  );
  const [saved, setSaved] = useState(() => JSON.stringify(fromRoster(roster)));
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<"save" | "publish" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const published = roster?.status === "PUBLICADA";
  const dirty = JSON.stringify(lines) !== saved;
  const byUser = useMemo(
    () => new Map(candidates.map((item) => [item.userId, item])),
    [candidates],
  );
  const selected = Object.keys(lines);
  const missingReason = selected.filter(
    (userId) =>
      (byUser.get(userId)?.busyWith.length ?? 0) > 0 &&
      !lines[userId].overrideReason?.trim(),
  );
  const uncovered = SECTIONS.filter(
    (section) =>
      candidates.some(
        (item) => item.section === section && item.memberStatus === "ATIVO",
      ) && !selected.some((userId) => byUser.get(userId)?.section === section),
  );

  const term = normalize(query.trim());
  const visible = candidates.filter(
    (item) =>
      !term ||
      normalize(`${item.warName} ${item.name}`).includes(term) ||
      item.instruments.some((i) => normalize(i.name).includes(term)),
  );

  function toggle(candidate: RosterCandidate) {
    setNotice(null);
    setLines((current) => {
      const next = { ...current };
      if (next[candidate.userId]) {
        delete next[candidate.userId];
      } else {
        next[candidate.userId] = {
          role: "MUSICO",
          instrumentId:
            candidate.instruments.find((i) => i.primary)?.instrumentId ?? null,
          notes: null,
          overrideReason: null,
        };
      }
      return next;
    });
  }

  function update(userId: string, patch: Partial<Line>) {
    setNotice(null);
    setLines((current) => ({
      ...current,
      [userId]: { ...current[userId], ...patch },
    }));
  }

  async function save(): Promise<boolean> {
    setError(null);
    try {
      const payload = Object.entries(lines).map(([userId, line]) => ({
        userId,
        ...line,
      }));
      const result = await rostersClient.save(eventId, payload);
      const next = fromRoster(result);
      setLines(next);
      setSaved(JSON.stringify(next));
      return true;
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a escala.",
      );
      return false;
    }
  }

  async function onSave() {
    setPending("save");
    if (await save()) {
      setNotice(
        published
          ? "Escala salva. Quem entrou, saiu ou mudou de função foi avisado."
          : "Rascunho salvo. Só gestores veem a escala até ela ser publicada.",
      );
      router.refresh();
    }
    setPending(null);
  }

  async function onPublish() {
    setPending("publish");
    const ok = !dirty || (await save());
    if (ok) {
      try {
        await rostersClient.publish(eventId);
        router.push(`/eventos/${eventId}`);
        router.refresh();
        return;
      } catch (cause) {
        setError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível publicar.",
        );
      }
    }
    setConfirmOpen(false);
    setPending(null);
  }

  return (
    <div className="space-y-5">
      {published && (
        <Alert tone="info" title="Escala publicada">
          Ao salvar, só quem entrou, saiu ou mudou de função recebe aviso. Quem
          mudou precisa confirmar a ciência de novo.
        </Alert>
      )}
      {error && <Alert tone="danger">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft" />
        <input
          aria-label="Buscar integrante ou instrumento"
          placeholder="Buscar integrante ou instrumento"
          className={cn(inputClasses, "pl-9")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {SECTIONS.map((section) => {
        const people = visible.filter((item) => item.section === section);
        if (people.length === 0) return null;
        const count = people.filter((item) => lines[item.userId]).length;
        return (
          <section key={section} className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
              {SECTION_LABELS[section]}
              <span className="font-normal text-soft">
                {count}/{people.length}
              </span>
            </h3>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {people.map((candidate) => (
                <CandidateRow
                  key={candidate.userId}
                  candidate={candidate}
                  line={lines[candidate.userId]}
                  onToggle={() => toggle(candidate)}
                  onChange={(patch) => update(candidate.userId, patch)}
                />
              ))}
            </ul>
          </section>
        );
      })}
      {visible.length === 0 && (
        <p className="text-sm text-muted">
          {candidates.length === 0
            ? "Nenhum integrante com cadastro na banda ainda. Cadastre em Músicos."
            : "Ninguém encontrado com essa busca."}
        </p>
      )}

      {/* Sticks to the bottom of the content column while scrolling. */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-fg">
              {selected.length} escalado{selected.length === 1 ? "" : "s"}
              {dirty && <span className="text-warning"> · não salvo</span>}
            </p>
            {missingReason.length > 0 ? (
              <p className="text-xs text-danger">
                Justifique o conflito de horário de{" "}
                {missingReason.map((id) => byUser.get(id)?.warName).join(", ")}.
              </p>
            ) : (
              uncovered.length > 0 && (
                <p className="text-xs text-soft">
                  Sem ninguém:{" "}
                  {uncovered.map((s) => SECTION_LABELS[s]).join(", ")}
                </p>
              )
            )}
          </div>
          <Button
            variant={published || !canPublish ? "primary" : "secondary"}
            icon={<Save className="size-4" />}
            loading={pending === "save"}
            disabled={!dirty || missingReason.length > 0 || pending !== null}
            onClick={onSave}
          >
            {published ? "Salvar alterações" : "Salvar rascunho"}
          </Button>
          {!published && canPublish && (
            <Button
              icon={<Megaphone className="size-4" />}
              disabled={
                selected.length === 0 ||
                missingReason.length > 0 ||
                pending !== null
              }
              onClick={() => setConfirmOpen(true)}
            >
              Publicar
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Publicar escala"
        icon={<Megaphone className="size-5" />}
        busy={pending === "publish"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={pending === "publish"}
            >
              Voltar
            </Button>
            <Button onClick={onPublish} loading={pending === "publish"}>
              Publicar e avisar
            </Button>
          </>
        }
      >
        As {selected.length} pessoas escaladas recebem o aviso no app e por
        e-mail, com o evento para salvar na agenda do celular, e passam a ver a
        escala. Depois disso, cada alteração avisa só quem for afetado.
      </Modal>
    </div>
  );
}

function CandidateRow({
  candidate,
  line,
  onToggle,
  onChange,
}: {
  candidate: RosterCandidate;
  line: Line | undefined;
  onToggle: () => void;
  onChange: (patch: Partial<Line>) => void;
}) {
  const checked = line !== undefined;
  // Someone already on the roster stays removable even if now blocked.
  const locked = candidate.blocker !== null && !checked;
  const id = `candidate-${candidate.userId}`;

  return (
    <li className={cn("px-3 py-2.5 text-sm", locked && "opacity-60")}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 size-4 accent-[var(--accent)]"
          checked={checked}
          disabled={locked}
          onChange={onToggle}
        />
        <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
          <span className="font-medium text-fg">
            {RANK_LABELS[candidate.rank].short} {candidate.warName}
          </span>
          <span className="block text-xs text-soft">
            {candidate.instruments.map((i) => i.name).join(", ") ||
              "Sem instrumento cadastrado"}
          </span>
        </label>
        {candidate.blocker && (
          <Badge tone="danger">{BLOCKER_LABELS[candidate.blocker]}</Badge>
        )}
        {!candidate.blocker && candidate.busyWith.length > 0 && (
          <Badge tone="warning">Outro evento</Badge>
        )}
      </div>

      {candidate.absence && (
        <p className="mt-1 ml-7 text-xs text-danger">
          {ABSENCE_TYPE_LABELS[candidate.absence.type]}:{" "}
          {formatPeriod(candidate.absence.startsOn, candidate.absence.endsOn)}
        </p>
      )}

      {checked && (
        <div className="mt-2 ml-7 grid gap-2 sm:grid-cols-2">
          <Select
            label="Função"
            required
            hideLabel
            value={line.role}
            options={ROLES.map((role) => ({
              value: role,
              label: ROLE_LABELS[role],
            }))}
            onChange={(e) =>
              onChange({ role: e.target.value as AssignmentRole })
            }
          />
          <Select
            label="Instrumento"
            hideLabel
            value={line.instrumentId ?? ""}
            placeholder="Sem instrumento"
            options={candidate.instruments.map((i) => ({
              value: i.instrumentId,
              label: i.name,
            }))}
            onChange={(e) => onChange({ instrumentId: e.target.value || null })}
          />
          {candidate.busyWith.length > 0 && (
            <div className="sm:col-span-2">
              <p className="mb-1 flex items-center gap-1 text-xs text-warning">
                <AlertTriangle className="size-3.5" />
                Também escalado em:{" "}
                {candidate.busyWith.map((e) => e.title).join(", ")}
              </p>
              <Field
                label="Justificativa para manter"
                required
                maxLength={300}
                value={line.overrideReason ?? ""}
                onChange={(e) => onChange({ overrideReason: e.target.value })}
              />
            </div>
          )}
          <Field
            label="Observação (opcional)"
            className="sm:col-span-2"
            maxLength={200}
            value={line.notes ?? ""}
            onChange={(e) => onChange({ notes: e.target.value || null })}
          />
        </div>
      )}
    </li>
  );
}
