"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/design-system";
import {
  readAudioDuration,
  repertoireClient,
  uploadToStorage,
} from "@/features/repertoire/api/repertoire.client";
import {
  ACCEPTED_AUDIO_TYPES,
  MAX_AUDIO_MB,
} from "@/features/repertoire/model/repertoire-labels";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Step = "idle" | "uploading" | "confirming";

// Picks a file, uploads it straight to storage with a signed form, then asks
// the API to confirm it. The file never passes through our servers.
export function AudioUploader({ songId }: { songId: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [progress, setProgress] = useState(0);
  const { showError } = useToast();

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      return showError(
        "Formato não aceito. Use MP3, M4A, AAC, OGG, WAV ou FLAC.",
      );
    }
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
      return showError(`O áudio pode ter no máximo ${MAX_AUDIO_MB} MB.`);
    }

    try {
      setStep("uploading");
      setProgress(0);
      const title = file.name.replace(/\.[^.]+$/, "").slice(0, 160) || "Áudio";
      const [ticket, duration] = await Promise.all([
        repertoireClient.requestAudioUpload({
          songId,
          title,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
        readAudioDuration(file),
      ]);
      await uploadToStorage(ticket, file, setProgress);
      setStep("confirming");
      await repertoireClient.confirmAudioUpload(ticket.asset.id, duration);
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível enviar o áudio.",
      );
    }
    setStep("idle");
  }

  const busy = step !== "idle";

  return (
    <div className="space-y-2">
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_AUDIO_TYPES.join(",")}
        className="hidden"
        onChange={onFile}
      />
      <Button
        variant="secondary"
        size="sm"
        loading={busy}
        icon={<Upload className="size-4" />}
        onClick={() => input.current?.click()}
      >
        {step === "uploading"
          ? `Enviando… ${Math.round(progress * 100)}%`
          : step === "confirming"
            ? "Finalizando…"
            : "Enviar áudio"}
      </Button>
      {step === "uploading" && (
        <div
          className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-brand-gold transition-[width]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
      <p className="text-xs text-soft">
        MP3, M4A, AAC, OGG, WAV ou FLAC, até {MAX_AUDIO_MB} MB.
      </p>
    </div>
  );
}
