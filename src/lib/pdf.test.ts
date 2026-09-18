import { describe, expect, it } from 'vitest';
import { jsPDF } from 'jspdf';
import { ascii, buildPdf } from './pdf';
import { assembleAll } from './assemble';
import { emptyAnswers, type Answers } from './answers';
import { copy } from '../content/copy';

const answers: Answers = {
  ...emptyAnswers,
  material: 'Paper boat handout with five folding steps, printed double sided.',
  kind: 'both',
  outcome: 'Fold a boat that floats for two minutes',
  barriers: ['vision'],
};

describe('pdf export', () => {
  it('folds typographic characters down to ASCII', () => {
    expect(ascii('“quoted” — it’s a test… · x')).toBe('"quoted" - it\'s a test... - x');
    expect(ascii(copy.stopAndRefer.items.join(' '))).not.toMatch(/[^\x00-\x7E\n]/);
  });

  it('renders every prompt across multiple pages with a credit link on each', () => {
    const items = assembleAll(answers);
    const doc = buildPdf(new jsPDF({ unit: 'mm', format: 'a4' }), items);
    const pages = doc.getNumberOfPages();
    expect(pages).toBeGreaterThan(1);

    const raw = doc.output();
    expect(raw.startsWith('%PDF')).toBe(true);
    // One link annotation per page, all pointing at the credit URL.
    expect(raw.split(copy.footer.url).length - 1).toBe(pages);
    expect(raw).toContain('/Annots');
  });
});
