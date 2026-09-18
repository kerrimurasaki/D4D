/** PDF export. jsPDF is loaded on demand so it stays out of the initial bundle. */
import type { jsPDF } from 'jspdf';
import type { AssembledPrompt } from './assemble';
import { copy } from '../content/copy';
import { colors } from '../theme/colors';

const PAGE = { width: 210, height: 297, margin: 18 }; // A4, millimetres
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;
const FOOT_ROOM = 22; // space kept clear for the page footer

/** jsPDF's built-in fonts are WinAnsi; fold typographic characters down to ASCII. */
export function ascii(text: string): string {
  return text
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[·•]/g, '-')
    .replace(/ /g, ' ')
    .replace(/[^\x00-\x7E\n]/g, '');
}

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export function buildPdf(doc: jsPDF, items: AssembledPrompt[]): jsPDF {
  let y = PAGE.margin;

  const room = (needed: number) => {
    if (y + needed > PAGE.height - PAGE.margin - FOOT_ROOM) {
      doc.addPage();
      y = PAGE.margin;
    }
  };

  interface WriteOptions {
    size?: number;
    style?: 'normal' | 'bold' | 'italic';
    font?: 'helvetica' | 'courier';
    color?: string;
    gap?: number;
    indent?: number;
  }

  const write = (
    text: string,
    { size = 10, style = 'normal', font = 'helvetica', color = colors.ink, gap = 2, indent = 0 }: WriteOptions = {},
  ) => {
    doc.setFont(font, style).setFontSize(size).setTextColor(...rgb(color));
    const lines = doc.splitTextToSize(ascii(text), CONTENT_WIDTH - indent) as string[];
    const lineHeight = size * 0.45;
    for (const line of lines) {
      room(lineHeight);
      doc.text(line, PAGE.margin + indent, y);
      y += lineHeight;
    }
    y += gap;
  };

  const rule = () => {
    room(6);
    doc.setDrawColor(...rgb(colors.line)).setLineWidth(0.4);
    doc.line(PAGE.margin, y, PAGE.width - PAGE.margin, y);
    y += 5;
  };

  write(copy.export.heading, { size: 20, style: 'bold', color: colors.deep, gap: 3 });
  write(copy.export.intro, { size: 10, color: colors.mute, gap: 5 });

  items.forEach((item, i) => {
    const { template, recommendation, text } = item;
    room(30);
    rule();
    write(`Step ${i + 1}: Prompt ${template.number} - ${template.title}`, {
      size: 14,
      style: 'bold',
      color: colors.deep,
      gap: 1,
    });
    write(`${copy.results.statusLabel[recommendation.status]} · ${template.tagline}`, {
      size: 9,
      style: 'bold',
      color: recommendation.status === 'required' ? colors.amber : colors.sage,
      gap: 2,
    });
    write(`${copy.results.why} ${recommendation.reason}`, { size: 10, gap: 2 });
    if (template.intro) write(template.intro, { size: 9, color: colors.mute, gap: 3, indent: 4 });
    write(text, { size: 8.5, font: 'courier', gap: 6 });
  });

  rule();
  write(copy.stopAndRefer.title, { size: 14, style: 'bold', color: colors.deep, gap: 1 });
  write(copy.stopAndRefer.lede, { size: 10, gap: 2 });
  for (const line of copy.stopAndRefer.items) write(`- ${line}`, { size: 10, gap: 1, indent: 3 });

  y += 3;
  rule();
  write(copy.disclaimer, { size: 8, color: colors.mute, gap: 2 });

  // Page footers: the credit link on every page, page numbers on the right.
  const pages = doc.getNumberOfPages();
  const footY = PAGE.height - 12;
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...rgb(colors.mute));
    const prefix = `${copy.footer.prefix} `;
    doc.text(prefix, PAGE.margin, footY);
    doc.setTextColor(...rgb(colors.deep));
    doc.textWithLink(copy.footer.name, PAGE.margin + doc.getTextWidth(prefix), footY, { url: copy.footer.url });
    doc.setTextColor(...rgb(colors.mute));
    doc.text(`${page} / ${pages}`, PAGE.width - PAGE.margin, footY, { align: 'right' });
  }

  return doc;
}

export async function downloadPdf(items: AssembledPrompt[]): Promise<void> {
  const { jsPDF: JsPDF } = await import('jspdf');
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  doc.setProperties({ title: copy.export.heading, creator: copy.footer.name });
  buildPdf(doc, items).save(copy.export.pdfFileName);
}
