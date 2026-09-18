import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { emptyAnswers, type Answers } from './answers';
import { recommend, skippedAnswers } from './router';
import { assembleAll, assemblePrompt } from './assemble';
import { copyAllText, markdownExport } from './export';
import { isVagueOutcome, firstIncompleteStep, validateStep } from './validation';
import { containsSensitiveTerms } from './privacyTerms';
import { MERGE_INSTRUCTION, PROMPTS, ROUTING_PROMPT } from '../content/prompts';
import { copy } from '../content/copy';

const base: Answers = {
  ...emptyAnswers,
  material: 'Fold the paper in half, then fold the corners down to make a boat.',
  outcome: 'Fold a boat that floats for two minutes',
};
const answers = (patch: Partial<Answers>): Answers => ({ ...base, ...patch });
const statusOf = (a: Answers) => Object.fromEntries(recommend(a).map((r) => [r.promptId, r.status]));
const order = (a: Answers) => recommend(a).map((r) => r.promptId);
const find = (a: Answers, id: string) => recommend(a).find((r) => r.promptId === id)!;

const textLens = PROMPTS.p1.lenses!.text!;
const procLens = PROMPTS.p1.lenses!.procedural!;

describe('routing (§12 criteria 1–5)', () => {
  it('1. text / order does not matter / present / no barriers', () => {
    const a = answers({ kind: 'text', sequence: 'no', presence: 'present', barriers: [] });
    expect(statusOf(a)).toEqual({
      p1: 'required', p2: 'required', p3: 'required', p4: 'required', p5: 'recommended', p6: 'optional',
    });
    expect(order(a)).toEqual(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
    const p1 = assemblePrompt('p1', a);
    expect(p1).toContain(textLens);
    expect(p1).not.toContain(procLens);
    expect(p1).not.toContain(MERGE_INSTRUCTION);
  });

  it('2. procedural + sequence yes makes checkpoints required with the sequence reason', () => {
    const a = answers({ kind: 'procedural', sequence: 'yes' });
    const p5 = find(a, 'p5');
    expect(p5.status).toBe('required');
    expect(p5.reason).toContain(copy.reasons.p5Sequence);
    expect(order(a).slice(0, 3)).toEqual(['p1', 'p2', 'p5']);
  });

  it('3. standalone makes checkpoints required even when order does not matter', () => {
    const p5 = find(answers({ kind: 'text', sequence: 'no', presence: 'standalone' }), 'p5');
    expect(p5.status).toBe('required');
    expect(p5.reason).toBe(copy.reasons.p5Standalone);
  });

  it('4. a vision barrier makes prompt 6 required with the vision reason', () => {
    const p6 = find(answers({ kind: 'text', barriers: ['vision'] }), 'p6');
    expect(p6).toEqual({ promptId: 'p6', status: 'required', reason: copy.reasons.p6Vision });
  });

  it('5. both → prompts 1 and 2 carry both lenses and the merge instruction', () => {
    const a = answers({ kind: 'both' });
    for (const id of ['p1', 'p2'] as const) {
      const text = assemblePrompt(id, a);
      const { text: t, procedural: p } = PROMPTS[id].lenses!;
      expect(text).toContain(t);
      expect(text).toContain(p);
      expect(text.indexOf(t!)).toBeLessThan(text.indexOf(p!));
      expect(text).toContain(MERGE_INSTRUCTION);
    }
  });

  it('skipped sequence defaults to yes for physical material and not sure for text', () => {
    expect(find(answers({ kind: 'procedural' }), 'p5').status).toBe('required');
    expect(find(answers({ kind: 'procedural' }), 'p5').reason).toBe(copy.reasons.p5SequenceAssumed);
    expect(find(answers({ kind: 'text' }), 'p5').status).toBe('recommended');
  });

  it('groups by status while keeping run order', () => {
    expect(order(answers({ kind: 'text', sequence: 'no', barriers: ['vision'] }))).toEqual(['p1', 'p2', 'p3', 'p4', 'p6', 'p5']);
    expect(order(answers({ kind: 'text', sequence: 'yes', barriers: ['vision'] }))).toEqual(['p1', 'p2', 'p5', 'p3', 'p4', 'p6']);
  });

  it('adds the standalone line to prompt 3 only when standalone', () => {
    expect(assemblePrompt('p3', answers({ kind: 'text', presence: 'standalone' }))).toContain('without me in the room');
    expect(assemblePrompt('p3', answers({ kind: 'text', presence: 'present' }))).not.toContain('without me in the room');
  });
});

describe('assembly (§12 criteria 6–9)', () => {
  const variants: Answers[] = [
    answers({ kind: 'text' }),
    answers({ kind: 'both', sequence: 'yes', presence: 'standalone', competency: 'Explain the process', delivery: 'Spoken presentation', constraints: ['time', 'room'], constraintsOther: '40 minutes', barriers: ['vision', 'hearing'], barriersOther: 'Cannot use stairs' }),
    { ...emptyAnswers, kind: 'procedural' },
  ];

  it('6. resolves every placeholder in every assembled prompt', () => {
    for (const a of variants) {
      for (const item of assembleAll(a)) {
        expect(item.text).not.toMatch(/\{\{|\}\}/);
        expect(item.text).not.toMatch(/\[PASTE\]|\[FROM PROMPT 0\]|\[DESCRIBE\]/);
      }
    }
  });

  it('7. a skipped Q5 produces the ask-me fallback, not an empty string', () => {
    const text = assemblePrompt('p1', answers({ kind: 'text', competency: '', delivery: '' }));
    expect(text).toContain(`The part that must not change: ${copy.askFallback.competency}`);
    expect(text).toContain(`The part that could be done another way: ${copy.askFallback.delivery}`);
    expect(assemblePrompt('p2', answers({ kind: 'text' }))).toContain(`How I currently deliver it: ${copy.askFallback.delivery}`);
  });

  it('interpolates answers, rendering chips as labels and presence as a sentence', () => {
    const text = assemblePrompt('p2', variants[1]);
    expect(text).toContain('The part that must not change: Explain the process');
    expect(text).toContain('How I currently deliver it: Spoken presentation');
    expect(text).toContain('Fixed constraints: Time in session, Room or layout, 40 minutes');
    expect(text).toContain('Access barriers I already know about: Vision, Hearing, Cannot use stairs');
    expect(text).toContain(`Where it's used: ${copy.presenceSentence.standalone}`);
    expect(text.startsWith('You are helping an educator')).toBe(true);
    expect(text.trimEnd().endsWith('Do not invent detail\nabout my learners or my room.')).toBe(true);
  });

  it('drops "nothing" chips when real ones are chosen, keeps them alone', () => {
    expect(assemblePrompt('p4', answers({ kind: 'text', constraints: ['nothing', 'time'] }))).toContain('Fixed constraints: Time in session\n');
    expect(assemblePrompt('p4', answers({ kind: 'text', barriers: ['none'] }))).toContain('Access barriers I already know about: None that I know of\n');
  });

  it('does not re-interpret braces in the educator’s own text', () => {
    expect(assemblePrompt('p1', answers({ kind: 'text', material: 'Use {{outcome}} literally in the sheet here' }))).toContain('Use {{outcome}} literally');
  });

  it('8. copy-all separates prompts with a divider, numbered in run order', () => {
    const items = assembleAll(variants[1]);
    const all = copyAllText(items);
    const headings = [...all.matchAll(/STEP (\d) OF 6 · PROMPT (\d)/g)].map((m) => [m[1], m[2]]);
    expect(headings).toEqual([['1', '1'], ['2', '2'], ['3', '5'], ['4', '3'], ['5', '4'], ['6', '6']]);
    expect(all.split('='.repeat(64)).length - 1).toBe(12);
    items.forEach((item) => expect(all).toContain(item.text));
  });

  it('9. markdown export contains every recommended prompt in balanced fences', () => {
    const a = answers({ kind: 'text', material: 'Some material with ``` a fence and ```` a longer one' });
    const items = assembleAll(a);
    const md = markdownExport(items);
    expect(md.startsWith('# ')).toBe(true);
    items.forEach((item) => {
      expect(md).toContain(item.text);
      expect(md).toContain(`Prompt ${item.template.number} — ${item.template.title}`);
    });
    expect(md).toContain('`````text');
    expect(md).toContain(copy.stopAndRefer.title);
    expect(md.trimEnd().endsWith(`${copy.footer.prefix} [${copy.footer.name}](${copy.footer.url})`)).toBe(true);
  });
});

describe('content fidelity (§12 criterion 15)', () => {
  const html = readFileSync(new URL('../../design-for-variability-prompt-pack.html', import.meta.url), 'utf8');
  const packBlocks = [...html.matchAll(/<pre>([\s\S]*?)<\/pre>/g)].map((m) => m[1]);

  it('every prompt and lens matches the v2 pack verbatim', () => {
    const ours = [
      ROUTING_PROMPT.packText,
      PROMPTS.p1.packText, PROMPTS.p1.lenses!.text, PROMPTS.p1.lenses!.procedural,
      PROMPTS.p2.packText, PROMPTS.p2.lenses!.text, PROMPTS.p2.lenses!.procedural,
      PROMPTS.p3.packText, PROMPTS.p4.packText, PROMPTS.p5.packText, PROMPTS.p6.packText,
    ];
    expect(ours).toEqual(packBlocks);
  });

  it('the app version differs from the pack only at the marker positions', () => {
    for (const t of Object.values(PROMPTS)) {
      const segments = t.packText.split(/\[PASTE\]|\[FROM PROMPT 0\]|\[DESCRIBE\]/);
      let cursor = 0;
      for (const segment of segments) {
        const at = t.base.indexOf(segment, cursor);
        expect(at).toBeGreaterThanOrEqual(cursor);
        cursor = at + segment.length;
      }
    }
  });
});

describe('flow rules', () => {
  it('13. Q1, Q2 and Q4 block; every other step passes empty', () => {
    expect(validateStep(1, emptyAnswers)).toBe(copy.interview.materialError);
    expect(validateStep(1, { ...emptyAnswers, material: 'too short' })).not.toBeNull();
    expect(validateStep(2, emptyAnswers)).not.toBeNull();
    expect(validateStep(4, emptyAnswers)).not.toBeNull();
    for (const step of [3, 5, 6, 7, 8]) expect(validateStep(step, emptyAnswers)).toBeNull();
    expect(firstIncompleteStep(answers({ kind: 'text' }))).toBeNull();
    expect(firstIncompleteStep(answers({}))).toBe(2);
  });

  it('14. nudges vague outcomes only', () => {
    for (const s of ['understand buoyancy', 'Understand X', 'Learners will understand how boats float', 'to know the rules', 'be aware of hazards', 'Be familiar with the lathe', 'appreciate poetry']) {
      expect(isVagueOutcome(s)).toBe(true);
    }
    for (const s of ['Fold a boat that floats for two minutes', 'Explain why a boat floats', '', 'knot a bowline']) {
      expect(isVagueOutcome(s)).toBe(false);
    }
  });

  it('counts skipped answers', () => {
    expect(skippedAnswers(answers({ kind: 'text' })).map((s) => s.key)).toEqual(['sequence', 'competency', 'delivery', 'presence', 'constraints', 'barriers']);
    expect(skippedAnswers(variants())).toEqual([]);
    function variants(): Answers {
      return answers({ kind: 'text', sequence: 'no', competency: 'a', delivery: 'b', presence: 'mixed', constraints: ['time'], barriersOther: 'x' });
    }
  });
});

describe('privacy guard', () => {
  it('flags diagnosis and identity terms', () => {
    for (const s of ['One student has ADHD', 'she was diagnosed last year', 'He has an EHCP', 'check the IEP', 'my dyslexic learner', 'has a statement of needs']) {
      expect(containsSensitiveTerms(s)).toBe(true);
    }
  });
  it('ignores barrier descriptions and ordinary words', () => {
    for (const s of ['Reading speed is slow for some', 'add the flour', 'Two learners cannot use the stairs', 'vision and hearing', 'send the email', '']) {
      expect(containsSensitiveTerms(s)).toBe(false);
    }
  });
});
