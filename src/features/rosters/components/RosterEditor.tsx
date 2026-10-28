"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Megaphone,
  Plus,
  Repeat,
  Save,
  Search,
  UserMinus,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Field,
  Modal,
  Select,
  cn,
  inputClasses,
} from "@/design-system";
import {
  ABSENCE_TYPE_LABELS,
  formatPeriod,
} from "@/features/availability/model/absence-labels";
import {
  SECTIONS,
  SECTION_LABELS,
  STATUS_LABELS,
} from "@/features/members/model/member-labels";
import { RankBadge } from "@/features/members/components/RankBadge";
import { rostersClient } from "@/features/rosters/api/rosters.client";
import { KeepOnRosterButton } from "@/features/rosters/components/KeepOnRosterButton";
import {
  DetailsList,
  DetailsToggle,
  personTitle,
  phoneValue,
  registrationValue,
} from "@/features/rosters/components/MemberDetails";
import {
  BLOCKER_LABELS,
  isMusicianFunction,
} from "@/features/rosters/model/roster-labels";
import type { BandFunction, Section } from "@/shared/contracts/members";
import type {
  AssignmentInput,
  Roster,
  RosterCandidate,
} from "@/shared/contracts/rosters";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Line = Omit<AssignmentInput, "userId">;
type Tab = "pick" | "roster";

const fromRoster = (roster: Roster | null): Record<string, Line> =>
  Object.fromEntries(
    (roster?.assignments ?? []).map((item) => [
      item.userId,
      {
        functionId: item.functionId,
        instrumentId: item.instrumentId,
        notes: item.notes,
        overrideReason: item.overrideReason,
      },
    ]),
  );

/** Who asked to be replaced on a published roster, with their reason. */
const swapsOf = (roster: Roster | null): Map<string, string | null> =>
  new Map(
    roster?.status === "PUBLICADA"
      ? roster.assignments
          .filter((item) => item.ackStatus === "TROCA_SOLICITADA")
          .map((item) => [item.userId, item.ackNote])
      : [],
  );

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const personName = (candidate: RosterCandidate) =>
  personTitle(candidate.rank, candidate.name);

// Building a roster in two steps: pick people on the left (by section, with
// search), then set each one's role and instrument on the right. People who
// can't go (inactive, away, approved absence) are listed but locked; someone
// on another event at the same time needs a justification. Used by the
// roster page and by the modal of the event drawer.
export function RosterEditor({
  eventId,
  candidates,
  functions,
  roster,
  canPublish,
  onPublished,
}: {
  eventId: string;
  candidates: RosterCandidate[];
  /** The band's functions (archived ones too: old lines keep theirs). */
  functions: BandFunction[];
  roster: Roster | null;
  canPublish: boolean;
  /** After publishing (default: back to the events table). */
  onPublished?: () => void;
}) {
  const router = useRouter();
  const [lines, setLines] = useState<Record<string, Line>>(() =>
    fromRoster(roster),
  );
  const [saved, setSaved] = useState(() => JSON.stringify(fromRoster(roster)));
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<Section | null>(null);
  const [tab, setTab] = useState<Tab>("pick");
  const { showError, showSuccess } = useToast();
  const [pending, setPending] = useState<"save" | "publish" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [swaps, setSwaps] = useState(() => swapsOf(roster));
  // Whose swap request is being solved by picking someone else.
  const [replacing, setReplacing] = useState<RosterCandidate | null>(null);

  const published = roster?.status === "PUBLICADA";
  const dirty = JSON.stringify(lines) !== saved;
  const byUser = useMemo(
    () => new Map(candidates.map((item) => [item.userId, item])),
    [candidates],
  );
  const selected = Object.keys(lines);
  const functionName = useMemo(
    () => new Map(functions.map((item) => [item.id, item.name])),
    [functions],
  );
  const musicianId = functions.find(
    (item) => !item.archived && isMusicianFunction(item.name),
  )?.id;
  const isMusicianLine = (line: Line) =>
    isMusicianFunction(
      line.functionId ? functionName.get(line.functionId) : null,
    );
  const missingReason = selected.filter(
    (userId) =>
      (byUser.get(userId)?.busyWith.length ?? 0) > 0 &&
      !lines[userId].overrideReason?.trim(),
  );
  // Sections with active people, and how many of them are on the roster.
  const coverage = SECTIONS.flatMap((item) => {
    const active = candidates.filter(
      (candidate) =>
        candidate.section === item && candidate.memberStatus === "ATIVO",
    );
    if (active.length === 0) return [];
    const count = selected.filter(
      (userId) => byUser.get(userId)?.section === item,
    ).length;
    return [{ section: item, count }];
  });
  const uncovered = coverage.filter((item) => item.count === 0);

  const term = normalize(query.trim());
  const visible = candidates.filter(
    (item) =>
      (!section || item.section === section) &&
      (!term ||
        normalize(
          `${item.warName} ${item.name} ${item.registration ?? ""}`,
        ).includes(term) ||
        item.instruments.some((i) => normalize(i.name).includes(term)) ||
        item.functions.some((f) => normalize(f.name).includes(term))),
  );
  const chosen = selected
    .map((userId) => byUser.get(userId))
    .filter((item): item is RosterCandidate => item !== undefined)
    // Other functions first (regente, chefe…), then musicians by section.
    .sort(
      (a, b) =>
        // Open swap requests on top, where the manager sees them first.
        Number(!swaps.has(a.userId)) - Number(!swaps.has(b.userId)) ||
        Number(isMusicianLine(lines[a.userId])) -
          Number(isMusicianLine(lines[b.userId])) ||
        SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) ||
        a.warName.localeCompare(b.warName),
    );

  function toggle(candidate: RosterCandidate) {
    setLines((current) => {
      const next = { ...current };
      if (next[candidate.userId]) {
        delete next[candidate.userId];
      } else {
        // Who plays goes as "Músico" with the main instrument; someone with
        // no instrument goes in their (first) function.
        const instrumentId =
          candidate.instruments.find((i) => i.primary)?.instrumentId ?? null;
        next[candidate.userId] = {
          functionId: instrumentId
            ? (musicianId ?? null)
            : (candidate.functions.find(
                (item) => !isMusicianFunction(item.name),
              )?.functionId ??
              musicianId ??
              null),
          instrumentId,
          notes: null,
          overrideReason: null,
        };
      }
      return next;
    });
  }

  function update(userId: string, patch: Partial<Line>) {
    setLines((current) => ({
      ...current,
      [userId]: { ...current[userId], ...patch },
    }));
  }

  async function save(toSave = lines): Promise<boolean> {
    try {
      const payload = Object.entries(toSave).map(([userId, line]) => ({
        userId,
        ...line,
      }));
      const result = await rostersClient.save(eventId, payload);
      const next = fromRoster(result);
      setLines(next);
      setSaved(JSON.stringify(next));
      setSwaps(swapsOf(result));
      return true;
    } catch (cause) {
      showError(
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
      showSuccess(
        published ? "Escala salva." : "Rascunho salvo.",
        published
          ? "Quem entrou, saiu ou mudou de função foi avisado."
          : "Só gestores veem a escala até ela ser publicada.",
      );
      router.refresh();
    }
    setPending(null);
  }

  /**
   * Puts `picked` in the place of whoever asked for the swap (same function;
   * the instrument when they play it too) and saves: both are told. With a
   * schedule conflict, the justification comes first.
   */
  async function substitute(picked: RosterCandidate) {
    if (!replacing) return;
    const old = lines[replacing.userId];
    const sameInstrument = picked.instruments.some(
      (item) => item.instrumentId === old.instrumentId,
    );
    const next = { ...lines };
    delete next[replacing.userId];
    next[picked.userId] = {
      functionId: old.functionId,
      instrumentId: sameInstrument
        ? old.instrumentId
        : (picked.instruments.find((i) => i.primary)?.instrumentId ?? null),
      notes: old.notes,
      overrideReason: null,
    };
    const leaving = personName(replacing);
    setReplacing(null);
    if (picked.busyWith.length > 0) {
      setLines(next);
      setTab("roster");
      showError(
        `${personName(picked)} também está em outro evento: justifique e salve.`,
      );
      return;
    }
    setPending("save");
    if (await save(next)) {
      showSuccess(
        "Troca feita.",
        `${leaving} saiu e ${personName(picked)} entrou. Os dois foram avisados.`,
      );
      router.refresh();
    }
    setPending(null);
  }

  function kept(userId: string) {
    setSwaps((current) => {
      const next = new Map(current);
      next.delete(userId);
      return next;
    });
    router.refresh();
  }

  async function onPublish() {
    setPending("publish");
    const ok = !dirty || (await save());
    if (ok) {
      try {
        await rostersClient.publish(eventId);
        showSuccess("Escala publicada.", "Os escalados foram avisados.");
        if (onPublished) {
          onPublished();
        } else {
          router.push("/eventos");
        }
        router.refresh();
        return;
      } catch (cause) {
        showError(
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
    <div className="space-y-4">
      {/* Where the roster stands: status, size and coverage per section. */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge tone={published ? "success" : roster ? "warning" : "neutral"}>
            {published ? "Publicada" : roster ? "Rascunho" : "Nova escala"}
          </Badge>
          <p className="text-sm font-semibold text-fg">
            {selected.length}{" "}
            {selected.length === 1 ? "pessoa escalada" : "pessoas escaladas"}
          </p>
          {dirty && (
            <span className="text-xs font-medium text-warning">
              Alterações não salvas
            </span>
          )}
        </div>
        {coverage.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Por naipe">
            {coverage.map((item) => (
              <li
                key={item.section}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs",
                  item.count > 0
                    ? "border-success-border bg-success-soft text-success"
                    : "border-border text-soft",
                )}
              >
                {SECTION_LABELS[item.section]} · {item.count}
              </li>
            ))}
          </ul>
        )}
        {swaps.size > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-danger">
            <Repeat className="size-3.5 shrink-0" />
            {swaps.size === 1
              ? "1 pedido de troca em aberto"
              : `${swaps.size} pedidos de troca em aberto`}
            : substitua ou mantenha na escala (no topo da etapa 2).
          </p>
        )}
        {published && (
          <p className="mt-3 text-xs text-muted">
            Escala já publicada: ao salvar, só quem entrou, saiu ou mudou de
            função recebe aviso e confirma a ciência de novo.
          </p>
        )}
      </div>

      {/* Phones: one step at a time. */}
      <div
        className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-muted p-1 lg:hidden"
        role="tablist"
      >
        {(
          [
            ["pick", "1. Escolher", candidates.length],
            ["roster", "2. Escalados", selected.length],
          ] as const
        ).map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
              tab === value
                ? "bg-surface text-fg shadow-sm"
                : "text-muted hover:text-fg",
            )}
          >
            {label} <span className="text-soft">({count})</span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Panel
          step="1"
          title="Escolha os integrantes"
          description="Toque para adicionar ou tirar da escala."
          className={cn(tab !== "pick" && "hidden lg:flex")}
        >
          <div className="space-y-3 border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft" />
              <input
                type="search"
                aria-label="Buscar integrante ou instrumento"
                placeholder="Buscar nome, matrícula, instrumento ou função"
                className={cn(inputClasses, "pl-9")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5" aria-label="Naipe">
              <Chip active={section === null} onClick={() => setSection(null)}>
                Todos
              </Chip>
              {coverage.map((item) => (
                <Chip
                  key={item.section}
                  active={section === item.section}
                  onClick={() =>
                    setSection(section === item.section ? null : item.section)
                  }
                >
                  {SECTION_LABELS[item.section]}
                </Chip>
              ))}
            </div>
          </div>
          <div className="lg:max-h-[60vh] lg:overflow-y-auto">
            {SECTIONS.map((item) => {
              const people = visible.filter(
                (candidate) => candidate.section === item,
              );
              if (people.length === 0) return null;
              const count = people.filter(
                (candidate) => lines[candidate.userId],
              ).length;
              return (
                <section key={item}>
                  <h4 className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface-muted px-3 py-1.5 text-[11px] font-semibold tracking-[0.07em] text-muted uppercase">
                    {SECTION_LABELS[item]}
                    <span className="font-normal tracking-normal normal-case">
                      {count} de {people.length}
                    </span>
                  </h4>
                  <ul className="divide-y divide-border">
                    {people.map((candidate) => (
                      <CandidateRow
                        key={candidate.userId}
                        candidate={candidate}
                        checked={lines[candidate.userId] !== undefined}
                        onToggle={() => toggle(candidate)}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
            {visible.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-soft">
                {candidates.length === 0
                  ? "Nenhum integrante com cadastro na banda ainda. Cadastre em Músicos."
                  : "Ninguém encontrado com esse filtro."}
              </p>
            )}
          </div>
        </Panel>

        <Panel
          step="2"
          title="Defina a função de cada um"
          description="Função, instrumento e observações de quem está na escala."
          className={cn(tab !== "roster" && "hidden lg:flex")}
        >
          {chosen.length === 0 ? (
            <div className="grid place-items-center gap-2 px-6 py-12 text-center">
              <span className="grid size-10 place-items-center rounded-full bg-surface-muted text-soft">
                <Users className="size-5" />
              </span>
              <p className="text-sm font-medium text-fg">
                Ninguém escalado ainda
              </p>
              <p className="max-w-xs text-xs text-soft">
                Adicione integrantes na etapa 1. Eles aparecem aqui para você
                definir a função e o instrumento.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border lg:max-h-[calc(60vh+7.5rem)] lg:overflow-y-auto">
              {chosen.map((candidate) => (
                <AssignmentRow
                  key={candidate.userId}
                  candidate={candidate}
                  line={lines[candidate.userId]}
                  functions={functions}
                  onChange={(patch) => update(candidate.userId, patch)}
                  onRemove={() => toggle(candidate)}
                  swap={
                    swaps.has(candidate.userId)
                      ? {
                          note: swaps.get(candidate.userId) ?? null,
                          busy: pending !== null,
                          onReplace: () => setReplacing(candidate),
                          keep: (
                            <KeepOnRosterButton
                              eventId={eventId}
                              userId={candidate.userId}
                              personName={personName(candidate)}
                              onKept={() => kept(candidate.userId)}
                            />
                          ),
                        }
                      : undefined
                  }
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Sticks to the bottom of the page or modal while scrolling. */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1 text-sm">
            {missingReason.length > 0 ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
                <AlertTriangle className="size-3.5 shrink-0" />
                Justifique o conflito de horário de{" "}
                {missingReason
                  .map((id) => {
                    const candidate = byUser.get(id);
                    return candidate ? personName(candidate) : "";
                  })
                  .join(", ")}
                .
              </p>
            ) : uncovered.length > 0 ? (
              <p className="text-xs text-soft">
                Sem ninguém:{" "}
                {uncovered
                  .map((item) => SECTION_LABELS[item.section])
                  .join(", ")}
              </p>
            ) : (
              selected.length > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-success">
                  <Check className="size-3.5" /> Todos os naipes cobertos
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

      {replacing && (
        <SubstituteModal
          replacing={replacing}
          candidates={candidates.filter(
            (item) => lines[item.userId] === undefined,
          )}
          onPick={(picked) => void substitute(picked)}
          onClose={() => setReplacing(null)}
        />
      )}

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

function Panel({
  step,
  title,
  description,
  className,
  children,
}: {
  step: string;
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface",
        className,
      )}
    >
      <header className="flex items-start gap-3 border-b border-border px-4 py-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg">
          {step}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          <p className="text-xs text-soft">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border text-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

// One person in step 1: adds or removes them. Blocked people stay visible
// with the reason; someone already on the roster stays removable.
function CandidateRow({
  candidate,
  checked,
  onToggle,
}: {
  candidate: RosterCandidate;
  checked: boolean;
  onToggle: () => void;
}) {
  const locked = candidate.blocker !== null && !checked;
  const [open, setOpen] = useState(false);

  return (
    <li className={cn(checked && "bg-accent-soft")}>
      <div className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={onToggle}
          disabled={locked}
          aria-pressed={checked}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-3 text-left text-sm transition-colors",
            !checked && "hover:bg-surface-muted",
            locked && "cursor-not-allowed opacity-60 hover:bg-transparent",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full border",
              checked
                ? "border-accent bg-accent text-accent-fg"
                : "border-border-strong text-soft",
            )}
          >
            {checked ? (
              <Check className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-fg">
              {personName(candidate)}
            </span>
            <span className="block truncate text-xs text-soft">
              {candidate.absence
                ? `${ABSENCE_TYPE_LABELS[candidate.absence.type]}: ${formatPeriod(candidate.absence.startsOn, candidate.absence.endsOn)}`
                : candidate.instruments.map((i) => i.name).join(", ") ||
                  "Sem instrumento cadastrado"}
            </span>
          </span>
          {candidate.blocker ? (
            <Badge tone="danger">{BLOCKER_LABELS[candidate.blocker]}</Badge>
          ) : (
            candidate.busyWith.length > 0 && (
              <Badge tone="warning">Outro evento</Badge>
            )
          )}
        </button>
        <DetailsToggle
          open={open}
          name={personName(candidate)}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <MemberDetails candidate={candidate} className="mx-3 mb-3 ml-13" />
      )}
    </li>
  );
}

// Everything about the musician, one item per line.
function MemberDetails({
  candidate,
  className,
}: {
  candidate: RosterCandidate;
  className?: string;
}) {
  const items: [string, ReactNode][] = [
    ["Nome de guerra", candidate.warName],
    ["Posto/graduação", <RankBadge key="rank" rank={candidate.rank} />],
    ["Naipe", SECTION_LABELS[candidate.section]],
    ["Situação", STATUS_LABELS[candidate.memberStatus]],
    [
      "Instrumentos",
      candidate.instruments.length > 0
        ? candidate.instruments
            .map((i) => (i.primary ? `${i.name} (principal)` : i.name))
            .join(", ")
        : "Nenhum cadastrado",
    ],
    [
      "Funções",
      candidate.functions.map((item) => item.name).join(", ") || "Nenhuma",
    ],
    ["Matrícula", registrationValue(candidate.registration)],
    ["Telefone", phoneValue(candidate.phone)],
  ];
  if (candidate.absence) {
    items.push([
      ABSENCE_TYPE_LABELS[candidate.absence.type],
      formatPeriod(candidate.absence.startsOn, candidate.absence.endsOn),
    ]);
  }
  if (candidate.busyWith.length > 0) {
    items.push([
      "Também escalado em",
      candidate.busyWith.map((e) => e.title).join(", "),
    ]);
  }

  return <DetailsList items={items} className={className} />;
}

// One person in step 2: role, instrument, note and, on a schedule
// conflict, the required justification.
function AssignmentRow({
  candidate,
  line,
  functions,
  onChange,
  onRemove,
  swap,
}: {
  candidate: RosterCandidate;
  line: Line;
  functions: BandFunction[];
  onChange: (patch: Partial<Line>) => void;
  onRemove: () => void;
  /** An open swap request: the reason and the two ways to solve it. */
  swap?: {
    note: string | null;
    busy: boolean;
    onReplace: () => void;
    keep: ReactNode;
  };
}) {
  const conflict = candidate.busyWith.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <li className={cn("space-y-3 px-4 py-3", swap && "bg-danger-soft/40")}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">
            {personName(candidate)}
          </p>
          <p className="text-xs text-soft">
            {SECTION_LABELS[candidate.section]}
          </p>
        </div>
        {candidate.blocker && (
          <Badge tone="danger">{BLOCKER_LABELS[candidate.blocker]}</Badge>
        )}
        <DetailsToggle
          open={open}
          name={personName(candidate)}
          onClick={() => setOpen(!open)}
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Tirar ${personName(candidate)} da escala`}
          title="Tirar da escala"
          className="grid size-8 shrink-0 place-items-center rounded-md text-soft transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <UserMinus className="size-4" />
        </button>
      </div>
      {swap && (
        <div className="space-y-2.5 rounded-md border border-danger-border bg-surface p-3">
          <div className="flex flex-wrap items-start gap-2">
            <Badge tone="danger">Pediu troca</Badge>
            {swap.note && (
              <p className="min-w-0 flex-1 text-[13px] break-words text-fg">
                “{swap.note}”
              </p>
            )}
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap [&>button]:justify-center">
            <Button
              size="sm"
              icon={<Repeat className="size-4" />}
              disabled={swap.busy}
              onClick={swap.onReplace}
            >
              Substituir
            </Button>
            {swap.keep}
          </div>
        </div>
      )}
      {open && <MemberDetails candidate={candidate} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Função"
          value={line.functionId ?? ""}
          required
          placeholder="Selecione"
          // Active functions, plus the line's own if it was archived since.
          options={functions
            .filter((item) => !item.archived || item.id === line.functionId)
            .map((item) => ({ value: item.id, label: item.name }))}
          onChange={(e) => onChange({ functionId: e.target.value || null })}
        />
        <Select
          label="Instrumento"
          value={line.instrumentId ?? ""}
          placeholder="Sem instrumento"
          options={candidate.instruments.map((i) => ({
            value: i.instrumentId,
            label: i.name,
          }))}
          onChange={(e) => onChange({ instrumentId: e.target.value || null })}
        />
      </div>
      {conflict && (
        <div className="space-y-2 rounded-md border border-warning-border bg-warning-soft p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
            <AlertTriangle className="size-3.5 shrink-0" />
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
        maxLength={200}
        placeholder="Ex.: levar estante"
        value={line.notes ?? ""}
        onChange={(e) => onChange({ notes: e.target.value || null })}
      />
    </li>
  );
}

// Picks who takes the place of someone who asked for a swap: same section
// first (the instrument usually matches), only people who can go.
function SubstituteModal({
  replacing,
  candidates,
  onPick,
  onClose,
}: {
  replacing: RosterCandidate;
  /** People not on the roster yet. */
  candidates: RosterCandidate[];
  onPick: (candidate: RosterCandidate) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sameSection, setSameSection] = useState(true);
  const term = normalize(query.trim());
  const options = candidates
    .filter(
      (item) =>
        item.blocker === null &&
        (!sameSection || item.section === replacing.section) &&
        (!term ||
          normalize(`${item.warName} ${item.name}`).includes(term) ||
          item.instruments.some((i) => normalize(i.name).includes(term))),
    )
    .sort(
      (a, b) =>
        a.busyWith.length - b.busyWith.length ||
        a.warName.localeCompare(b.warName),
    );

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      icon={<Repeat className="size-5" />}
      title={`Substituir ${personName(replacing)}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Voltar
        </Button>
      }
    >
      <div className="space-y-3">
        <p>
          Quem você escolher entra na mesma função e é avisado; quem pediu a
          troca sai da escala e também é avisado.
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft" />
          <input
            type="search"
            aria-label="Buscar substituto"
            placeholder="Buscar nome ou instrumento"
            className={cn(inputClasses, "pl-9")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
          <input
            type="checkbox"
            className="size-4 accent-[var(--accent)]"
            checked={sameSection}
            onChange={(e) => setSameSection(e.target.checked)}
          />
          Só do naipe {SECTION_LABELS[replacing.section]}
        </label>
        {options.length === 0 ? (
          <p className="rounded-lg border border-border px-3 py-6 text-center text-sm text-soft">
            Ninguém disponível
            {sameSection ? " neste naipe: desmarque para ver todos" : ""}.
          </p>
        ) : (
          <ul className="max-h-[50vh] divide-y divide-border overflow-y-auto rounded-lg border border-border">
            {options.map((item) => (
              <li key={item.userId}>
                <button
                  type="button"
                  onClick={() => onPick(item)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-muted"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">
                      {personName(item)}
                    </span>
                    <span className="block truncate text-xs text-soft">
                      {item.instruments.map((i) => i.name).join(", ") ||
                        "Sem instrumento cadastrado"}
                    </span>
                  </span>
                  {item.busyWith.length > 0 && (
                    <Badge tone="warning">Outro evento</Badge>
                  )}
                  <span className="shrink-0 text-xs font-medium text-accent">
                    Escolher
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
