"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Search } from "lucide-react";
import { Button, Field, Modal, Spinner, cn } from "@/design-system";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import { formatDuration } from "@/features/repertoire/model/repertoire-labels";
import type { YoutubeVideoResult } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// In-app YouTube search: type, search, mark one video and confirm.
export function YoutubeSearchModal({
  open,
  onClose,
  initialQuery,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  initialQuery: string;
  onPick: (video: YoutubeVideoResult) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<YoutubeVideoResult[] | null>(null);
  const [selected, setSelected] = useState<YoutubeVideoResult | null>(null);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function search() {
    if (query.trim().length < 2) return;
    setPending(true);
    setSelected(null);
    try {
      setResults(await repertoireClient.searchYoutube(query.trim()));
    } catch (cause) {
      setResults(null);
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível buscar no YouTube.",
      );
    }
    setPending(false);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Buscar vídeo no YouTube"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!selected}
            onClick={() => selected && onPick(selected)}
            icon={<Check className="size-4" />}
          >
            Usar este vídeo
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <form
          role="search"
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void search();
          }}
        >
          <Field
            label="Pesquisar"
            className="flex-1"
            data-autofocus
            placeholder="Nome da música e cantor"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button
            type="submit"
            loading={pending}
            disabled={query.trim().length < 2}
            icon={<Search className="size-4" />}
          >
            Buscar
          </Button>
        </form>

        {pending && !results && (
          <div className="grid place-items-center py-8">
            <Spinner />
          </div>
        )}

        {results && results.length === 0 && (
          <p className="py-6 text-center text-sm text-soft">
            Nenhum vídeo encontrado.
          </p>
        )}

        {results && results.length > 0 && (
          <ul
            role="listbox"
            aria-label="Vídeos encontrados"
            className="max-h-[50vh] space-y-1.5 overflow-y-auto"
          >
            {results.map((video) => {
              const active = selected?.videoId === video.videoId;
              return (
                <li key={video.videoId}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => setSelected(video)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors",
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-border hover:border-brand-gold hover:bg-surface-muted",
                    )}
                  >
                    <Image
                      src={video.thumbnailUrl}
                      alt=""
                      width={120}
                      height={68}
                      className="h-[68px] w-[120px] shrink-0 rounded object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] font-medium text-fg">
                        {video.title}
                      </span>
                      <span className="block truncate text-xs text-soft">
                        {video.durationSeconds
                          ? `${video.channelTitle} · ${formatDuration(video.durationSeconds)}`
                          : video.channelTitle}
                      </span>
                    </span>
                    {active && (
                      <Check
                        aria-hidden
                        className="size-4 shrink-0 text-accent"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
