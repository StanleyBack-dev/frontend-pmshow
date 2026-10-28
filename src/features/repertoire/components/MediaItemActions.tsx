"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Field, Modal } from "@/design-system";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import type { MediaAsset } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Mode = "rename" | "remove" | null;

// Rename / remove buttons for one audio or video (MEDIA_UPLOAD).
export function MediaItemActions({ asset }: { asset: MediaAsset }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [title, setTitle] = useState(asset.title);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function run() {
    setPending(true);
    try {
      if (mode === "rename")
        await repertoireClient.renameMedia(asset.id, title);
      else await repertoireClient.removeMedia(asset.id);
      setMode(null);
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  const kind = asset.kind === "AUDIO" ? "áudio" : "vídeo";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setTitle(asset.title);
          setMode("rename");
        }}
        aria-label={`Renomear ${kind}`}
        title="Renomear"
        className="grid size-8 place-items-center rounded-md text-soft hover:bg-surface-muted hover:text-fg"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setMode("remove")}
        aria-label={`Remover ${kind}`}
        title="Remover"
        className="grid size-8 place-items-center rounded-md text-soft hover:bg-danger-soft hover:text-danger"
      >
        <Trash2 className="size-4" />
      </button>
      <Modal
        open={mode !== null}
        onClose={() => setMode(null)}
        title={mode === "rename" ? `Renomear ${kind}` : `Remover ${kind}`}
        tone={mode === "remove" ? "danger" : "neutral"}
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setMode(null)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button
              variant={mode === "remove" ? "danger" : "primary"}
              onClick={run}
              loading={pending}
              disabled={mode === "rename" && !title.trim()}
            >
              {mode === "remove" ? "Remover" : "Salvar"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {mode === "rename" ? (
            <Field
              label="Título"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          ) : (
            <p>
              Remover “{asset.title}”?{" "}
              {asset.kind === "AUDIO"
                ? "O arquivo é apagado do armazenamento."
                : "O vídeo continua no YouTube; só sai desta música."}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
