import { MATERIAL_MIN_LENGTH, TOTAL_STEPS, type Answers } from './answers';
import { copy } from '../content/copy';

/** Blocking validation for required steps (Q1, Q2, Q4). Returns an error message or null. */
export function validateStep(step: number, answers: Answers): string | null {
  if (step === 1 && answers.material.trim().length < MATERIAL_MIN_LENGTH) return copy.interview.materialError;
  if (step === 2 && !answers.kind) return copy.interview.kindError;
  if (step === 4 && !answers.outcome.trim()) return copy.interview.outcomeError;
  return null;
}

/** First required step that isn't valid yet, or null when results can be shown. */
export function firstIncompleteStep(answers: Answers): number | null {
  for (let step = 1; step <= TOTAL_STEPS; step++) {
    if (validateStep(step, answers)) return step;
  }
  return null;
}

const VAGUE_VERBS = /^(?:understand|know|appreciate|be aware of|be familiar with|grasp|learn about)\b/;
const LEAD_IN = /^(?:(?:the\s+)?(?:learners?|students?|participants?|pupils?|they)\s+(?:will|should|can|must)\s+)?(?:be\s+able\s+to\s+)?(?:to\s+)?/;

/** Soft Q4 nudge: outcome framed as an internal state rather than something observable. */
export function isVagueOutcome(outcome: string): boolean {
  const normalised = outcome.trim().toLowerCase().replace(LEAD_IN, '');
  return VAGUE_VERBS.test(normalised);
}
