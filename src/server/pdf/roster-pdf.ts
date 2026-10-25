import "server-only";
import {
  PDFDocument,
  StandardFonts,
  degrees,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { UNIFORM_LABELS } from "@/features/events/model/event-labels";
import { RANK_LABELS } from "@/features/members/model/member-labels";
import {
  ROLE_LABELS,
  sortedLines,
} from "@/features/rosters/model/roster-labels";
import type { BandEvent } from "@/shared/contracts/events";
import type { AckStatus, Roster } from "@/shared/contracts/rosters";
import {
  formatDateTime,
  formatFullDay,
  formatTime,
} from "@/shared/lib/datetime";

// Printable roster (A4) to send by WhatsApp or attach to an official letter.
// Standard Helvetica (WinAnsi) covers Portuguese text; anything outside it is
// replaced so a stray emoji in a note never breaks the file.

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 40;
// The app palette (app/globals.css): chrome green, brass gold, ink.
const CHROME = rgb(0.055, 0.086, 0.063);
const GOLD = rgb(0.82, 0.631, 0.165);
const INK = rgb(0.106, 0.11, 0.09);
const MUTED = rgb(0.361, 0.333, 0.278);
const LINE = rgb(0.886, 0.863, 0.812);
const LIGHT = rgb(0.949, 0.925, 0.867);

const COLUMNS = [
  { label: "Nº", width: 26 },
  { label: "Posto/Grad.", width: 62 },
  { label: "Nome de guerra", width: 142 },
  { label: "Função", width: 96 },
  { label: "Instrumento", width: 112 },
  { label: "Ciência", width: 77 },
] as const;

const ROW_HEIGHT = 20;

/** Short answers that fit the column. */
const PDF_ACK: Record<AckStatus, string> = {
  PENDENTE: "Pendente",
  CIENTE: "Ciente",
  TROCA_SOLICITADA: "Pediu troca",
};

type Fonts = { regular: PDFFont; bold: PDFFont };

/** Keeps only characters the font can encode. */
function safe(font: PDFFont, text: string): string {
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
function fit(font: PDFFont, text: string, size: number, width: number) {
  let value = safe(font, text);
  if (font.widthOfTextAtSize(value, size) <= width) return value;
  while (value && font.widthOfTextAtSize(`${value}…`, size) > width) {
    value = value.slice(0, -1);
  }
  return `${value}…`;
}

export async function buildRosterPdf(
  event: BandEvent,
  roster: Roster,
  generatedAt: Date,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Escala — ${event.title}`);
  pdf.setAuthor("PM SHOW");
  pdf.setLanguage("pt-BR");
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };

  const lines = sortedLines(roster);
  const pages: PDFPage[] = [];
  let page = newPage(pdf, pages, fonts, event, roster);
  let y = drawEventHeader(page, fonts, event, roster);
  y = drawTableHeader(page, fonts, y);

  lines.forEach((line, index) => {
    if (y - ROW_HEIGHT < MARGIN + 30) {
      page = newPage(pdf, pages, fonts, event, roster);
      y = drawTableHeader(page, fonts, A4.height - MARGIN - 50);
    }
    const cells = [
      String(index + 1),
      line.person ? RANK_LABELS[line.person.rank].short : "—",
      line.person?.warName ?? "Conta desativada",
      ROLE_LABELS[line.role],
      line.instrumentName ?? "—",
      roster.status === "PUBLICADA" ? PDF_ACK[line.ackStatus] : "—",
    ];
    let x = MARGIN;
    cells.forEach((cell, column) => {
      const { width } = COLUMNS[column];
      page.drawText(fit(fonts.regular, cell, 9, width - 6), {
        x: x + 3,
        y: y - 13,
        size: 9,
        font: column === 2 ? fonts.bold : fonts.regular,
        color: INK,
      });
      x += width;
    });
    page.drawLine({
      start: { x: MARGIN, y: y - ROW_HEIGHT },
      end: { x: A4.width - MARGIN, y: y - ROW_HEIGHT },
      thickness: 0.5,
      color: LINE,
    });
    y -= ROW_HEIGHT;
  });

  if (lines.length === 0) {
    page.drawText("Ninguém escalado.", {
      x: MARGIN,
      y: y - 16,
      size: 10,
      font: fonts.regular,
      color: MUTED,
    });
  }

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

  return pdf.save();
}

function newPage(
  pdf: PDFDocument,
  pages: PDFPage[],
  fonts: Fonts,
  event: BandEvent,
  roster: Roster,
): PDFPage {
  const page = pdf.addPage([A4.width, A4.height]);
  pages.push(page);
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
      `Banda da Polícia Militar de Goiás · Escala: ${event.title}`,
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
  if (roster.status === "RASCUNHO") {
    page.drawText("RASCUNHO", {
      x: A4.width / 2 - 150,
      y: A4.height / 2 - 40,
      size: 72,
      font: fonts.bold,
      color: rgb(0.925, 0.906, 0.863),
      rotate: degrees(30),
    });
  }
  return page;
}

function drawEventHeader(
  page: PDFPage,
  fonts: Fonts,
  event: BandEvent,
  roster: Roster,
): number {
  let y = A4.height - MARGIN - 40;
  page.drawText(fit(fonts.bold, event.title, 18, A4.width - 2 * MARGIN), {
    x: MARGIN,
    y,
    size: 18,
    font: fonts.bold,
    color: INK,
  });
  y -= 22;

  const day = formatFullDay(event.startsAt);
  const rows: [string, string][] = [
    ["Data", day.charAt(0).toUpperCase() + day.slice(1)],
    ...(event.callTime
      ? ([["Concentração", formatTime(event.callTime)]] as [string, string][])
      : []),
    [
      "Horário",
      event.endsAt
        ? `${formatTime(event.startsAt)} às ${formatTime(event.endsAt)}`
        : formatTime(event.startsAt),
    ],
    [
      "Local",
      event.venue
        ? `${event.venue.name} — ${event.venue.fullAddress}`
        : "A definir",
    ],
    ...(event.uniform
      ? ([["Uniforme", UNIFORM_LABELS[event.uniform]]] as [string, string][])
      : []),
    ...(event.documentRef
      ? ([["Documento", event.documentRef]] as [string, string][])
      : []),
    [
      "Escala",
      roster.status === "PUBLICADA"
        ? `Publicada · ${roster.assignments.length} pessoa${roster.assignments.length === 1 ? "" : "s"}`
        : "Rascunho (ainda não publicada)",
    ],
  ];
  for (const [label, value] of rows) {
    page.drawText(label, {
      x: MARGIN,
      y,
      size: 9,
      font: fonts.regular,
      color: MUTED,
    });
    page.drawText(fit(fonts.bold, value, 10, A4.width - 2 * MARGIN - 90), {
      x: MARGIN + 90,
      y,
      size: 10,
      font: fonts.bold,
      color: INK,
    });
    y -= 15;
  }
  return y - 10;
}

function drawTableHeader(page: PDFPage, fonts: Fonts, y: number): number {
  page.drawRectangle({
    x: MARGIN,
    y: y - ROW_HEIGHT,
    width: A4.width - 2 * MARGIN,
    height: ROW_HEIGHT,
    color: rgb(0.965, 0.925, 0.816),
  });
  let x = MARGIN;
  for (const column of COLUMNS) {
    page.drawText(column.label, {
      x: x + 3,
      y: y - 13,
      size: 8,
      font: fonts.bold,
      color: INK,
    });
    x += column.width;
  }
  return y - ROW_HEIGHT;
}
