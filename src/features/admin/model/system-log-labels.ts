import type { Tone } from "@/design-system";
import type {
  SystemCategory,
  SystemLevel,
} from "@/shared/contracts/system-logs";

export const LEVEL_LABELS: Record<SystemLevel, { label: string; tone: Tone }> =
  {
    INFO: { label: "Informação", tone: "info" },
    WARN: { label: "Atenção", tone: "warning" },
    ERROR: { label: "Erro", tone: "danger" },
    CRITICAL: { label: "Crítico", tone: "danger" },
  };

export const CATEGORY_LABELS: Record<SystemCategory, string> = {
  API: "API",
  DATABASE: "Banco de dados",
  AUTH: "Autenticação",
  SECURITY: "Segurança",
  OUTBOX: "Envio de avisos",
  ROUTINE: "Rotinas (GitHub)",
  FRONTEND: "Telas do app",
  SYSTEM: "Sistema",
};

export const ENVIRONMENTS = [
  { value: "production", label: "Produção" },
  { value: "preview", label: "Beta / preview" },
  { value: "development", label: "Desenvolvimento" },
];

export const environmentLabel = (value: string) =>
  ENVIRONMENTS.find((item) => item.value === value)?.label ?? value;
