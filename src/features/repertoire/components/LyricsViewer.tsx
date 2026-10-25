"use client";

import { useEffect, useRef, useState } from "react";
import { AArrowDown, AArrowUp, Pause, Play, ScrollText, X } from "lucide-react";
import { Hint } from "@/design-system";
import { usePlayer } from "@/features/player/components/PlayerProvider";

const SIZES = ["text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl"];
const SIZE_KEY = "pmshow:lyrics-size";

const DEFAULT_SIZE = 2;

function readSize(): number {
  try {
    const raw = localStorage.getItem(SIZE_KEY);
    const saved = raw === null ? NaN : Number(raw);
    return Number.isInteger(saved) && saved >= 0 && saved < SIZES.length
      ? saved
      : DEFAULT_SIZE;
  } catch {
    return DEFAULT_SIZE;
  }
}

// Row control next to "edit": opens the lyrics alone, full screen, so the
// singers can read them on stage. Without lyrics it explains why.
export function LyricsButton({
  title,
  lyrics,
}: {
  title: string;
  lyrics: string | null;
}) {
  const [open, setOpen] = useState(false);

  if (!lyrics?.trim()) {
    return (
      <Hint
        icon={<ScrollText aria-hidden className="size-4 opacity-40" />}
        label={`${title}: sem letra`}
      >
        Esta música ainda não tem letra cadastrada.
      </Hint>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ver a letra de ${title}`}
        title="Ver só a letra (tela cheia)"
        className="grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
      >
        <ScrollText aria-hidden className="size-4" />
      </button>
      {open && (
        <LyricsViewer
          title={title}
          lyrics={lyrics}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// Full-screen, high-contrast lyrics. The text size is remembered on the
// device, and the screen is kept awake while it is open (where supported).
export function LyricsViewer({
  title,
  lyrics,
  onClose,
}: {
  title: string;
  lyrics: string;
  onClose: () => void;
}) {
  const player = usePlayer();
  const ref = useRef<HTMLDialogElement>(null);
  const [size, setSize] = useState(readSize);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const acquire = async () => {
      try {
        const sentinel = await navigator.wakeLock?.request("screen");
        if (cancelled) void sentinel?.release();
        else lock = sentinel ?? null;
      } catch {
        // Not supported or refused (e.g. battery saver): reading still works.
      }
    };
    // The lock drops when the tab is hidden; take it again on return.
    const onVisible = () => {
      if (document.visibilityState === "visible") void acquire();
    };
    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, []);

  function resize(step: number) {
    const next = Math.min(SIZES.length - 1, Math.max(0, size + step));
    setSize(next);
    try {
      localStorage.setItem(SIZE_KEY, String(next));
    } catch {
      // Private mode: the size just isn't remembered.
    }
  }

  const control =
    "grid size-10 place-items-center rounded-md text-chrome-subtle transition-colors hover:bg-chrome-hover hover:text-chrome-fg disabled:opacity-30";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={`Letra de ${title}`}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-chrome p-0 text-chrome-fg backdrop:bg-black"
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-chrome-line px-4 py-2">
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold">
            {title}
          </h2>
          {/* Read and listen: the playing track keeps its controls here. */}
          {player.current && (
            <button
              type="button"
              onClick={player.toggle}
              aria-label={player.playing ? "Pausar" : "Tocar"}
              className={control}
            >
              {player.playing ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => resize(-1)}
            disabled={size === 0}
            aria-label="Diminuir a letra"
            className={control}
          >
            <AArrowDown className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => resize(1)}
            disabled={size === SIZES.length - 1}
            aria-label="Aumentar a letra"
            className={control}
          >
            <AArrowUp className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Fechar a letra"
            className={control}
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <p
            className={`mx-auto max-w-3xl leading-relaxed font-medium whitespace-pre-line ${SIZES[size]}`}
          >
            {lyrics}
          </p>
        </div>
      </div>
    </dialog>
  );
}
