import "server-only";
import { rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatDateTime } from "@/shared/lib/datetime";

// What the printable documents (roster, list of songs) share: A4 pages with
// the app's palette, the PM SHOW bar on top and the "generated on" footer.
// Standard Helvetica (WinAnsi) covers Portuguese text; anything outside it is
// replaced so a stray emoji in a note never breaks the file.

export const A4 = { width: 595.28, height: 841.89 };
export const MARGIN = 40;
// The app palette (app/globals.css): chrome green, brass gold, ink.
export const CHROME = rgb(0.055, 0.086, 0.063);
export const GOLD = rgb(0.82, 0.631, 0.165);
export const INK = rgb(0.106, 0.11, 0.09);
export const MUTED = rgb(0.361, 0.333, 0.278);
export const LINE = rgb(0.886, 0.863, 0.812);
export const LIGHT = rgb(0.949, 0.925, 0.867);
/** Table header background. */
export const HEADER_FILL = rgb(0.965, 0.925, 0.816);

export type Fonts = { regular: PDFFont; bold: PDFFont };

/** Keeps only characters the font can encode. */
export function safe(font: PDFFont, text: string): string {
  return [...text.normalize("NFC")]
    .map((char) => {
      try {
        font.encodeText(char);
        return char;
      } catch {
        return "?";
      }
    })
    .join("");
}

/** Cuts the text with "…" to fit `width`. */
export function fit(font: PDFFont, text: string, size: number, width: number) {
  let value = safe(font, text);
  if (font.widthOfTextAtSize(value, size) <= width) return value;
  while (value && font.widthOfTextAtSize(`${value}…`, size) > width) {
    value = value.slice(0, -1);
  }
  return `${value}…`;
}

/** Breaks the text into lines that fit `width` (long words are cut). */
export function wrap(
  font: PDFFont,
  text: string,
  size: number,
  width: number,
): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of safe(font, text).split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width) {
      current = next;
    } else {
      if (current) lines.push(current);
      current =
        font.widthOfTextAtSize(word, size) <= width
          ? word
          : fit(font, word, size, width);
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

/** The PM SHOW bar on top of every page, with what the document is. */
export function drawBrandBar(page: PDFPage, fonts: Fonts, subtitle: string) {
  page.drawRectangle({
    x: 0,
    y: A4.height - 34,
    width: A4.width,
    height: 34,
    color: CHROME,
  });
  page.drawText("PM", {
    x: MARGIN,
    y: A4.height - 22,
    size: 12,
    font: fonts.bold,
    color: LIGHT,
  });
  page.drawText("SHOW", {
    x: MARGIN + 21,
    y: A4.height - 22,
    size: 12,
    font: fonts.bold,
    color: GOLD,
  });
  page.drawText(
    fit(
      fonts.regular,
      `Banda da Polícia Militar de Goiás · ${subtitle}`,
      9,
      A4.width - 2 * MARGIN - 70,
    ),
    {
      x: MARGIN + 70,
      y: A4.height - 21,
      size: 9,
      font: fonts.regular,
      color: LIGHT,
    },
  );
}

/** Label / value lines under the title (long values wrap). */
export function drawFacts(
  page: PDFPage,
  fonts: Fonts,
  rows: [string, string][],
  top: number,
): number {
  let y = top;
  for (const [label, value] of rows) {
    page.drawText(label, {
      x: MARGIN,
      y,
      size: 9,
      font: fonts.regular,
      color: MUTED,
    });
    for (const text of wrap(
      fonts.bold,
      value,
      10,
      A4.width - 2 * MARGIN - 90,
    )) {
      page.drawText(text, {
        x: MARGIN + 90,
        y,
        size: 10,
        font: fonts.bold,
        color: INK,
      });
      y -= 13;
    }
    y -= 2;
  }
  return y;
}

/** "Gerado em … · página n de N" at the bottom of every page. */
export function drawFooters(pages: PDFPage[], fonts: Fonts, generatedAt: Date) {
  const stamp = `Gerado em ${formatDateTime(generatedAt.toISOString())}`;
  pages.forEach((current, index) => {
    current.drawText(`${stamp} · página ${index + 1} de ${pages.length}`, {
      x: MARGIN,
      y: MARGIN - 14,
      size: 8,
      font: fonts.regular,
      color: MUTED,
    });
  });
}

/** File names: "escala-desfile-civico-2026-11-03.pdf". */
export const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "evento";
