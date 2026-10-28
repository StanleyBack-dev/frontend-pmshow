"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, UserRound } from "lucide-react";
import { Button } from "@/design-system";
import { useToast } from "@/shared/toast/useToast";

/** What the server accepts; the browser also checks before sending. */
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
/** Original file chosen on the phone (shrunk below before sending). */
const MAX_ORIGINAL_BYTES = 10 * 1024 * 1024;
const SIDE = 512;

export type ProfilePhoto = {
  /** JPEG, base64 without the data: prefix (what the API receives). */
  base64: string;
  /** Local preview (object URL). */
  previewUrl: string;
};

/** Centered square crop, scaled to 512px, as JPEG. */
async function toSquareJpeg(file: File): Promise<ProfilePhoto> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIDE;
  canvas.height = SIDE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    SIDE,
    SIDE,
  );
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.88),
  );
  if (!blob) throw new Error("encode");
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return { base64: btoa(binary), previewUrl: URL.createObjectURL(blob) };
}

// Profile photo (sign-up form and "Meu perfil"): picked from the phone
// (camera or gallery), cropped and shrunk here; the server checks and
// re-encodes it. The value may also be a photo already stored (its link).
export function ProfilePhotoField({
  value,
  onChange,
  pending = false,
  hint = "Opcional. Rosto visível, de frente. JPEG, PNG ou WebP.",
}: {
  value: { previewUrl: string } | null;
  onChange: (value: ProfilePhoto | null) => void;
  /** Saving elsewhere (e.g. the upload of "Meu perfil"). */
  pending?: boolean;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const { showError } = useToast();
  const [busy, setBusy] = useState(false);

  // Free a local preview when it is replaced or the form goes away.
  useEffect(
    () => () => {
      if (value?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(value.previewUrl);
      }
    },
    [value],
  );

  async function pick(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      return showError("Use uma foto JPEG, PNG ou WebP.");
    }
    if (file.size > MAX_ORIGINAL_BYTES) {
      return showError("A foto é grande demais (máximo de 10 MB).");
    }
    setBusy(true);
    try {
      onChange(await toSquareJpeg(file));
    } catch {
      showError("Não foi possível ler esta foto. Tente outra.");
    }
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-4">
      <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-muted text-soft">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img
            src={value.previewUrl}
            alt="Prévia da foto de perfil"
            className="size-full object-cover"
          />
        ) : (
          <UserRound className="size-8" aria-hidden />
        )}
      </span>
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={busy || pending}
            icon={<Camera className="size-4" />}
            onClick={() => input.current?.click()}
          >
            {value ? "Trocar foto" : "Escolher foto"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Trash2 className="size-4" />}
              disabled={busy || pending}
              onClick={() => onChange(null)}
            >
              Remover
            </Button>
          )}
        </div>
        <p className="text-xs text-soft">{hint}</p>
        <input
          ref={input}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-label="Foto de perfil"
          onChange={(event) => {
            void pick(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
