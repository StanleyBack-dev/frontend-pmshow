"use client";

import { Field } from "@/design-system";
import { PASSWORD_HINT } from "@/features/auth/model/password-rules";

// "New password" + "confirm" pair shared by first access, profile and
// recovery.
export function NewPasswordFields({
  password,
  confirmation,
  onPassword,
  onConfirmation,
}: {
  password: string;
  confirmation: string;
  onPassword: (value: string) => void;
  onConfirmation: (value: string) => void;
}) {
  return (
    <>
      <div>
        <Field
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => onPassword(event.target.value)}
        />
        <p className="mt-1.5 text-xs text-soft">{PASSWORD_HINT}</p>
      </div>
      <Field
        label="Repita a nova senha"
        type="password"
        autoComplete="new-password"
        required
        value={confirmation}
        onChange={(event) => onConfirmation(event.target.value)}
      />
    </>
  );
}
