// Keys offered in the song form (12 major, 12 minor), with the spelling most
// used in band parts. The backend accepts any key written A–G + #/b + m.

const NOTE_NAMES: Record<string, string> = {
  C: "Dó",
  D: "Ré",
  E: "Mi",
  F: "Fá",
  G: "Sol",
  A: "Lá",
  B: "Si",
};

const MAJOR = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const MINOR = [
  "Cm",
  "C#m",
  "Dm",
  "Ebm",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Am",
  "Bbm",
  "Bm",
];

/** "Bb" → "Si bemol maior", "F#m" → "Fá sustenido menor". */
export function musicalKeyName(key: string): string {
  const minor = key.endsWith("m");
  const accidental =
    key[1] === "#" ? " sustenido" : key[1] === "b" ? " bemol" : "";
  const note = NOTE_NAMES[key[0]] ?? key[0];
  return `${note}${accidental} ${minor ? "menor" : "maior"}`;
}

export const MUSICAL_KEYS = [...MAJOR, ...MINOR];

/** Options for a Select, keeping a saved key that is outside the list. */
export function musicalKeyOptions(current?: string | null) {
  const keys =
    current && !MUSICAL_KEYS.includes(current)
      ? [current, ...MUSICAL_KEYS]
      : MUSICAL_KEYS;
  return keys.map((key) => ({
    value: key,
    label: `${key} — ${musicalKeyName(key)}`,
  }));
}
