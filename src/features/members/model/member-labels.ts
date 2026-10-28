import type { MemberStatus, Rank, Section } from "@/shared/contracts/members";

export const RANK_LABELS: Record<Rank, { label: string; short: string }> = {
  SOLDADO: { label: "Soldado", short: "Sd" },
  CABO: { label: "Cabo", short: "Cb" },
  TERCEIRO_SARGENTO: { label: "3º Sargento", short: "3º Sgt" },
  SEGUNDO_SARGENTO: { label: "2º Sargento", short: "2º Sgt" },
  PRIMEIRO_SARGENTO: { label: "1º Sargento", short: "1º Sgt" },
  SUBTENENTE: { label: "Subtenente", short: "ST" },
  CADETE: { label: "Cadete", short: "Cad" },
  ASPIRANTE: { label: "Aspirante a Oficial", short: "Asp" },
  SEGUNDO_TENENTE: { label: "2º Tenente", short: "2º Ten" },
  PRIMEIRO_TENENTE: { label: "1º Tenente", short: "1º Ten" },
  CAPITAO: { label: "Capitão", short: "Cap" },
  MAJOR: { label: "Major", short: "Maj" },
  TENENTE_CORONEL: { label: "Tenente-Coronel", short: "Ten Cel" },
  CORONEL: { label: "Coronel", short: "Cel" },
  CIVIL: { label: "Civil", short: "Civil" },
};

export const RANKS = Object.keys(RANK_LABELS) as Rank[];

/** Civilians are shown in another color, to tell them apart. */
export const isCivil = (rank: Rank | null | undefined) => rank === "CIVIL";

export const SECTION_LABELS: Record<Section, string> = {
  MADEIRAS: "Madeiras",
  METAIS: "Metais",
  PERCUSSAO: "Percussão",
  CORDAS_BASE: "Cordas e base",
  VOCAL: "Vocal",
  TECNICA: "Técnica",
};

export const SECTIONS = Object.keys(SECTION_LABELS) as Section[];

export const STATUS_LABELS: Record<MemberStatus, string> = {
  ATIVO: "Ativo",
  AFASTADO: "Afastado",
  INATIVO: "Inativo",
};

export const STATUSES = Object.keys(STATUS_LABELS) as MemberStatus[];

/** "62999991234" → "(62) 99999-1234". */
export function formatPhone(digits: string | null): string {
  if (!digits) return "—";
  const match = /^(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : digits;
}
