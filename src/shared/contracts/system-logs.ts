import type { Paginated } from "@/shared/contracts/api";

export const SYSTEM_LEVELS = ["INFO", "WARN", "ERROR", "CRITICAL"] as const;
export type SystemLevel = (typeof SYSTEM_LEVELS)[number];

export const SYSTEM_CATEGORIES = [
  "API",
  "DATABASE",
  "AUTH",
  "SECURITY",
  "OUTBOX",
  "ROUTINE",
  "FRONTEND",
  "SYSTEM",
] as const;
export type SystemCategory = (typeof SYSTEM_CATEGORIES)[number];

/** A record of the system log (Administração → Logs). */
export type SystemLog = {
  id: string;
  level: SystemLevel;
  category: SystemCategory;
  /** Where it happened: operation, route, workflow… */
  source: string;
  message: string;
  details: Record<string, unknown> | null;
  userId: string | null;
  userName: string | null;
  ip: string | null;
  statusCode: number | null;
  durationMs: number | null;
  environment: string;
  createdAt: string;
};

export type SystemLogFilter = {
  from?: string;
  to?: string;
  levels?: SystemLevel[];
  categories?: SystemCategory[];
  search?: string;
  environment?: string;
};

export type SystemLogSummary = {
  level: SystemLevel;
  last24h: number;
  last7d: number;
};

export type SystemLogPage = Paginated<SystemLog>;
