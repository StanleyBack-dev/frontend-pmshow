import "server-only";
import {
  PDFDocument,
  StandardFonts,
  degrees,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import {
  A4,
  HEADER_FILL,
  INK,
  LINE,
  MARGIN,
  MUTED,
  drawBrandBar,
  drawFacts,
  drawFooters,
  fit,
  wrap,
  type Fonts,
} from "@/server/pdf/pdf-kit";
import { UNIFORM_LABELS } from "@/features/events/model/event-labels";
import { RANK_LABELS } from "@/features/members/model/member-labels";
import {
  MUSICIAN_FUNCTION,
  sortedLines,
} from "@/features/rosters/model/roster-labels";
import type { BandEvent } from "@/shared/contracts/events";
import type { AckStatus, Roster } from "@/shared/contracts/rosters";
import { formatFullDay, formatTime } from "@/shared/lib/datetime";

// Printable roster (A4) to send by WhatsApp or attach to an official letter.

// 515 pt: the A4 width without the margins.
const COLUMNS = [
  { label: "Nº", width: 22 },
  { label: "Posto/Graduação", width: 84 },
  { label: "Nome completo / de guerra", width: 175 },
  { label: "Função", width: 70 },
  { label: "Instrumento", width: 88 },
  { label: "Ciência", width: 76 },
] as const;

const ROW_HEIGHT = 20;
const LINE_HEIGHT = 11;
const CELL_PADDING = 9;

/** Short answers that fit the column. */
const PDF_ACK: Record<AckStatus, string> = {
  PENDENTE: "Pendente",
  CIENTE: "Ciente",
  TROCA_SOLICITADA: "Pediu troca",
};

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
    const person = line.person;
    // Each cell: its lines and their font; the name cell adds the war name.
    const cells: { text: string[]; font: PDFFont; size: number }[][] = [
      [String(index + 1)],
      [person ? RANK_LABELS[person.rank].label : "—"],
      [person?.name ?? "Conta desativada"],
      [line.functionName ?? MUSICIAN_FUNCTION],
      [line.instrumentName ?? "—"],
      [roster.status === "PUBLICADA" ? PDF_ACK[line.ackStatus] : "—"],
    ].map(([text], column) => {
      const width = COLUMNS[column].width - 6;
      const font = column === 2 ? fonts.bold : fonts.regular;
      const parts = [{ text: wrap(font, text, 9, width), font, size: 9 }];
      if (column === 2 && person) {
        parts.push({
          text: wrap(fonts.regular, `Guerra: ${person.warName}`, 8, width),
          font: fonts.regular,
          size: 8,
        });
      }
      return parts;
    });
    const lineCount = Math.max(
      ...cells.map((parts) =>
        parts.reduce((total, part) => total + part.text.length, 0),
      ),
    );
    const height = Math.max(ROW_HEIGHT, lineCount * LINE_HEIGHT + CELL_PADDING);

    if (y - height < MARGIN + 30) {
      page = newPage(pdf, pages, fonts, event, roster);
      y = drawTableHeader(page, fonts, A4.height - MARGIN - 50);
    }
    let x = MARGIN;
    cells.forEach((parts, column) => {
      let textY = y - 13;
      for (const part of parts) {
        for (const text of part.text) {
          page.drawText(text, {
            x: x + 3,
            y: textY,
            size: part.size,
            font: part.font,
            color: part.size < 9 ? MUTED : INK,
          });
          textY -= LINE_HEIGHT;
        }
      }
      x += COLUMNS[column].width;
    });
    page.drawLine({
      start: { x: MARGIN, y: y - height },
      end: { x: A4.width - MARGIN, y: y - height },
      thickness: 0.5,
      color: LINE,
    });
    y -= height;
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

  drawFooters(pages, fonts, generatedAt);

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
  drawBrandBar(page, fonts, `Escala: ${event.title}`);
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
  y = drawFacts(page, fonts, rows, y);
  return y - 10;
}

function drawTableHeader(page: PDFPage, fonts: Fonts, y: number): number {
  page.drawRectangle({
    x: MARGIN,
    y: y - ROW_HEIGHT,
    width: A4.width - 2 * MARGIN,
    height: ROW_HEIGHT,
    color: HEADER_FILL,
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
