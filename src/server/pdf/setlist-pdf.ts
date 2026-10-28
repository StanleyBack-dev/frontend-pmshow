import "server-only";
import { PDFDocument, StandardFonts, type PDFPage } from "pdf-lib";
import { UNIFORM_LABELS } from "@/features/events/model/event-labels";
import { formatDuration } from "@/features/repertoire/model/repertoire-labels";
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
import type { EventWithSetlist } from "@/shared/contracts/events";
import { formatFullDay, formatTime } from "@/shared/lib/datetime";

// The event's list of songs (A4), in order, to print or send to the band.

// 515 pt: the A4 width without the margins.
const COLUMNS = [
  { label: "Nº", width: 24 },
  { label: "Música", width: 236 },
  { label: "Tom", width: 50 },
  { label: "Duração", width: 55 },
  { label: "Observações", width: 150 },
] as const;

const ROW_HEIGHT = 20;
const LINE_HEIGHT = 11;
const CELL_PADDING = 9;

export async function buildSetlistPdf(
  event: EventWithSetlist,
  generatedAt: Date,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Lista de músicas — ${event.title}`);
  pdf.setAuthor("PM SHOW");
  pdf.setLanguage("pt-BR");
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  const subtitle = `Lista de músicas: ${event.title}`;
  const pages: PDFPage[] = [];
  const newPage = () => {
    const page = pdf.addPage([A4.width, A4.height]);
    pages.push(page);
    drawBrandBar(page, fonts, subtitle);
    return page;
  };

  const items = [...event.setlist].sort((a, b) => a.position - b.position);
  const total = items.reduce(
    (sum, item) => sum + (item.song?.durationSeconds ?? 0),
    0,
  );

  let page = newPage();
  let y = A4.height - MARGIN - 40;
  page.drawText(fit(fonts.bold, event.title, 18, A4.width - 2 * MARGIN), {
    x: MARGIN,
    y,
    size: 18,
    font: fonts.bold,
    color: INK,
  });
  const day = formatFullDay(event.startsAt);
  y = drawFacts(
    page,
    fonts,
    [
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
      ["Local", event.venue?.name ?? "A definir"],
      ...(event.uniform
        ? ([["Uniforme", UNIFORM_LABELS[event.uniform]]] as [string, string][])
        : []),
      [
        "Músicas",
        `${items.length} música${items.length === 1 ? "" : "s"}${
          total > 0 ? ` · cerca de ${Math.round(total / 60)} min` : ""
        }`,
      ],
    ],
    y - 22,
  );
  y = drawTableHeader(page, fonts, y - 10);

  items.forEach((item, index) => {
    const cells: { text: string[]; bold: boolean }[] = [
      String(index + 1),
      item.song?.title ?? "Música removida do repertório",
      item.song?.musicalKey ?? "—",
      formatDuration(item.song?.durationSeconds),
      item.notes ?? "",
    ].map((text, column) => {
      const bold = column === 1;
      return {
        text: wrap(
          bold ? fonts.bold : fonts.regular,
          text,
          9,
          COLUMNS[column].width - 6,
        ),
        bold,
      };
    });
    const height = Math.max(
      ROW_HEIGHT,
      Math.max(...cells.map((cell) => cell.text.length)) * LINE_HEIGHT +
        CELL_PADDING,
    );
    if (y - height < MARGIN + 30) {
      page = newPage();
      y = drawTableHeader(page, fonts, A4.height - MARGIN - 50);
    }
    let x = MARGIN;
    cells.forEach((cell, column) => {
      let textY = y - 13;
      for (const text of cell.text) {
        page.drawText(text, {
          x: x + 3,
          y: textY,
          size: 9,
          font: cell.bold ? fonts.bold : fonts.regular,
          color: column === 4 ? MUTED : INK,
        });
        textY -= LINE_HEIGHT;
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

  if (items.length === 0) {
    page.drawText("Nenhuma música definida.", {
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
