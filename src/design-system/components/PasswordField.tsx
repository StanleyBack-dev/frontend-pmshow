"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Field } from "@/design-system/components/Field";

type PasswordFieldProps = Omit<
  ComponentProps<typeof Field>,
  "type" | "trailing"
> & {
  /** Hides the lock icon on the left. */
  plain?: boolean;
};

// Password input with an eye button to show or hide what was typed. The
// button keeps focus on the field's side (type="button"), so pressing Enter
// still submits the form.
export function PasswordField({ plain = false, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      icon={plain ? undefined : <LockKeyhole />}
      autoCapitalize="none"
      spellCheck={false}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          title={visible ? "Ocultar senha" : "Mostrar senha"}
          className="grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
        >
          {visible ? (
            <EyeOff aria-hidden className="size-4" />
          ) : (
            <Eye aria-hidden className="size-4" />
          )}
        </button>
      }
    />
  );
}
