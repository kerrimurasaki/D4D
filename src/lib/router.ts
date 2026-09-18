/**
 * Recommendation engine (PRD §5). Pure and deterministic: answers in, ordered list out.
 * No React imports.
 */
import type { Answers, Kind, Presence, Sequence } from './answers';
import type { PromptId } from '../content/prompts';
import { VISION_BARRIER } from '../content/questions';
import { copy } from '../content/copy';

export type Status = 'required' | 'recommended' | 'optional';

export interface Recommendation {
  promptId: PromptId;
  status: Status;
  reason: string;
}

export type Lens = 'text' | 'procedural';

/** §5.4 — the order prompts are run in, before grouping by status. */
const RUN_ORDER: PromptId[] = ['p1', 'p2', 'p5', 'p3', 'p4', 'p6'];
const STATUS_RANK: Record<Status, number> = { required: 0, recommended: 1, optional: 2 };

/** Q3 default when skipped: yes for anything physical, otherwise not sure. */
export function effectiveSequence(answers: Pick<Answers, 'sequence' | 'kind'>): Sequence {
  if (answers.sequence) return answers.sequence;
  return answers.kind === 'procedural' || answers.kind === 'both' ? 'yes' : 'not-sure';
}

/** Q6 default when skipped. */
export function effectivePresence(answers: Pick<Answers, 'presence'>): Presence {
  return answers.presence ?? 'mixed';
}

/** §5.2 — which lenses prompts 1 and 2 carry. */
export function lensesFor(kind: Kind | null): Lens[] {
  if (kind === 'text') return ['text'];
  if (kind === 'procedural') return ['procedural'];
  return ['text', 'procedural'];
}

export function recommend(answers: Answers): Recommendation[] {
  const { reasons } = copy;
  const sequence = effectiveSequence(answers);
  const presence = effectivePresence(answers);

  const p5Reasons: string[] = [];
  if (sequence === 'yes') p5Reasons.push(answers.sequence ? reasons.p5Sequence : reasons.p5SequenceAssumed);
  if (presence === 'standalone') p5Reasons.push(reasons.p5Standalone);

  const hasVision = answers.barriers.includes(VISION_BARRIER);

  const byId: Record<PromptId, Recommendation> = {
    p1: { promptId: 'p1', status: 'required', reason: reasons.p1 },
    p2: { promptId: 'p2', status: 'required', reason: reasons.p2 },
    p3: { promptId: 'p3', status: 'required', reason: reasons.p3 },
    p4: { promptId: 'p4', status: 'required', reason: reasons.p4 },
    p5: p5Reasons.length
      ? { promptId: 'p5', status: 'required', reason: p5Reasons.join(' ') }
      : { promptId: 'p5', status: 'recommended', reason: reasons.p5Recommended },
    p6: hasVision
      ? { promptId: 'p6', status: 'required', reason: reasons.p6Vision }
      : { promptId: 'p6', status: 'optional', reason: reasons.p6Optional },
  };

  // Array.prototype.sort is stable, so run order is preserved within each status group.
  return RUN_ORDER.map((id) => byId[id]).sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
}

export type SkippableKey = keyof typeof copy.skippedNames;

/** Skippable answers left empty, in interview order, with the step to edit them on. */
export function skippedAnswers(answers: Answers): { key: SkippableKey; step: number }[] {
  const skipped: { key: SkippableKey; step: number }[] = [];
  if (!answers.sequence) skipped.push({ key: 'sequence', step: 3 });
  if (!answers.competency.trim()) skipped.push({ key: 'competency', step: 5 });
  if (!answers.delivery.trim()) skipped.push({ key: 'delivery', step: 5 });
  if (!answers.presence) skipped.push({ key: 'presence', step: 6 });
  if (!answers.constraints.length && !answers.constraintsOther.trim()) skipped.push({ key: 'constraints', step: 7 });
  if (!answers.barriers.length && !answers.barriersOther.trim()) skipped.push({ key: 'barriers', step: 8 });
  return skipped;
}
