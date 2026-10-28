import type { Tone } from "@/design-system";
import type {
  SupportCategory,
  SupportStatus,
} from "@/shared/contracts/support";

export const SUPPORT_CATEGORY_LABELS: Record<SupportCategory, string> = {
  DUVIDA: "Dúvida",
  PROBLEMA: "Problema técnico / erro",
  ACESSO: "Acesso / conta",
  SUGESTAO: "Sugestão",
  OUTRO: "Outro",
};

export const SUPPORT_CATEGORIES = Object.keys(
  SUPPORT_CATEGORY_LABELS,
) as SupportCategory[];

export const SUPPORT_STATUS: Record<
  SupportStatus,
  { label: string; tone: Tone }
> = {
  ABERTO: { label: "Aberto", tone: "warning" },
  RESPONDIDO: { label: "Respondido", tone: "info" },
  FINALIZADO: { label: "Finalizado", tone: "success" },
};

export const SUPPORT_STATUSES = Object.keys(SUPPORT_STATUS) as SupportStatus[];

/** "#000042". */
export const protocolLabel = (protocol: number) =>
  `#${String(protocol).padStart(6, "0")}`;
