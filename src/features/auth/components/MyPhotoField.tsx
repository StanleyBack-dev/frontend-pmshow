"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/features/auth/api/auth.client";
import {
  ProfilePhotoField,
  type ProfilePhoto,
} from "@/features/enrollment/components/ProfilePhotoField";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// The signed-in user's photo: saved as soon as it is picked or removed; the
// refresh updates the account button of the sidebar.
export function MyPhotoField({ initialUrl }: { initialUrl: string | null }) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [url, setUrl] = useState(initialUrl);
  const [pending, setPending] = useState(false);

  async function change(photo: ProfilePhoto | null) {
    setPending(true);
    try {
      if (photo) {
        const { photoUrl } = await authClient.setPhoto(photo.base64);
        setUrl(photoUrl);
        showSuccess("Foto atualizada.");
      } else {
        await authClient.removePhoto();
        setUrl(null);
        showSuccess("Foto removida.");
      }
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a foto.",
      );
    }
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    setPending(false);
  }

  return (
    <ProfilePhotoField
      value={url ? { previewUrl: url } : null}
      onChange={change}
      pending={pending}
      hint="Rosto visível, de frente. JPEG, PNG ou WebP. Aparece no botão Conta do menu."
    />
  );
}
