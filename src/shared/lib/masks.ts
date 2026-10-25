// Input masks, applied as the user types, and the matching validation
// messages (null = valid). They only shape and check the text in the form;
// the backend validates every value again.

const digitsOf = (value: string) => value.replace(/\D/g, "");

// --- phone (Brazil) ---------------------------------------------------------

/** "(62) 3333-0000" or "(62) 99999-0000", built while typing. */
export function maskPhone(value: string): string {
  // A pasted "+55 …" keeps only DDD + number.
  const all = digitsOf(value);
  const digits = (
    all.length > 11 && all.startsWith("55") ? all.slice(2) : all
  ).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  // 8 digits: landline (4-4); 9 digits: mobile (5-4).
  const split = number.length > 8 ? 5 : 4;
  return number.length <= split
    ? `(${ddd}) ${number}`
    : `(${ddd}) ${number.slice(0, split)}-${number.slice(split)}`;
}

export function phoneError(value: string): string | null {
  const digits = digitsOf(value);
  if (digits.length === 0) return null;
  if (digits.length < 10) return "Informe o DDD e o número completo.";
  if (digits.length === 11 && digits[2] !== "9") {
    return "Celular começa com 9 depois do DDD.";
  }
  return null;
}

// --- duration (minutes:seconds) ----------------------------------------------

export const MAX_DURATION_SECONDS = 60 * 60;

/** Digits become "m:ss" / "mm:ss" while typing: "345" → "3:45". */
export function maskDuration(value: string): string {
  const digits = digitsOf(value).slice(0, 4);
  return digits.length <= 2
    ? digits
    : `${Number(digits.slice(0, -2))}:${digits.slice(-2)}`;
}

/** On leaving the field, bare minutes are completed: "4" → "4:00". */
export function completeDuration(value: string): string {
  return /^\d{1,2}$/.test(value) ? `${Number(value)}:00` : value;
}

/** "3:45" → 225; null when empty; NaN when not minutes:seconds. */
export function durationToSeconds(value: string): number | null {
  const text = completeDuration(value.trim());
  if (!text) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(text);
  return match ? Number(match[1]) * 60 + Number(match[2]) : Number.NaN;
}

export function durationError(value: string): string | null {
  const text = completeDuration(value.trim());
  if (!text) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(text);
  if (!match) return "Use minutos:segundos, ex.: 3:45.";
  if (Number(match[2]) > 59) return "Os segundos vão de 00 a 59.";
  const seconds = Number(match[1]) * 60 + Number(match[2]);
  if (seconds === 0) return "A duração deve ser maior que zero.";
  if (seconds > MAX_DURATION_SECONDS) return "A duração máxima é 60:00.";
  return null;
}

// --- tempo (BPM) ------------------------------------------------------------

export const BPM_RANGE = { min: 20, max: 300 } as const;

export const maskBpm = (value: string) => digitsOf(value).slice(0, 3);

export function bpmError(value: string): string | null {
  if (!value) return null;
  const bpm = Number(value);
  return bpm < BPM_RANGE.min || bpm > BPM_RANGE.max
    ? `Entre ${BPM_RANGE.min} e ${BPM_RANGE.max} BPM.`
    : null;
}

// --- registration (matrícula) ------------------------------------------------

/** Letters and digits only, uppercase (as the backend stores it). */
export const maskRegistration = (value: string) =>
  value
    .replace(/[^0-9a-z]/gi, "")
    .toUpperCase()
    .slice(0, 20);

export function registrationError(value: string): string | null {
  return value && value.length < 3 ? "Mínimo de 3 letras ou números." : null;
}

// --- login, war name, links ----------------------------------------------------

/** Login: lowercase letters, digits, dot, hyphen, underscore; 3–32. */
export const maskUsername = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32);

export function usernameError(value: string): string | null {
  return value && value.length < 3 ? "Mínimo de 3 caracteres." : null;
}

/** War name (nome de guerra) is stored in uppercase. */
export const maskWarName = (value: string) =>
  value.toUpperCase().replace(/\s{2,}/g, " ");

export function urlError(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:"
      ? null
      : "O link deve começar com https://";
  } catch {
    return "Cole o link completo, começando com https://";
  }
}

// --- address (Brazil) ----------------------------------------------------------

/** "74000000" → "74000-000" while typing. */
export function maskZipCode(value: string): string {
  const digits = digitsOf(value).slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

export function zipCodeError(value: string): string | null {
  const digits = digitsOf(value);
  return digits.length === 0 || digits.length === 8
    ? null
    : "O CEP tem 8 números (ex.: 74000-000).";
}

/** House number: digits and one letter ("12A"), or "S/N". */
export function maskAddressNumber(value: string): string {
  const text = value.toUpperCase().replace(/\s/g, "");
  // "S", "S/", "SN" and "S/N" lead to "S/N" (sem número).
  if (text === "SN") return "S/N";
  if (/^S\/?N?$/.test(text)) return text;
  return text.replace(/[^0-9A-Z]/g, "").slice(0, 7);
}

export function addressNumberError(value: string): string | null {
  if (!value) return null;
  return /^(\d{1,6}[A-Z]?|S\/N)$/.test(value)
    ? null
    : "Use números (ex.: 123 ou 12A) ou S/N.";
}
