/** Placeholder interpolation and prompt assembly (PRD §6). Pure; no React imports. */
import type { Answers } from './answers';
import {
  CLOSING,
  MERGE_INSTRUCTION,
  PREAMBLE,
  PROMPTS,
  STANDALONE_P3_LINE,
  type Placeholder,
  type PromptId,
  type PromptTemplate,
} from '../content/prompts';
import {
  BARRIER_OPTIONS,
  CONSTRAINT_OPTIONS,
  NO_BARRIERS,
  NOTHING_CONSTRAINT,
  type Option,
} from '../content/questions';
import { copy } from '../content/copy';
import { effectivePresence, lensesFor, recommend, type Recommendation } from './router';

/** Chip labels plus free text, comma-joined. A "nothing" chip is dropped when anything else is chosen. */
function joinChips(ids: string[], other: string, options: Option<string>[], noneId: string): string {
  const meaningful = ids.length > 1 ? ids.filter((id) => id !== noneId) : ids;
  const labels = options.filter((o) => meaningful.includes(o.value)).map((o) => o.label);
  const extra = other.trim();
  return [...labels, ...(extra ? [extra] : [])].join(', ');
}

export function placeholderValues(answers: Answers): Record<Placeholder, string> {
  const raw: Record<Placeholder, string> = {
    material: answers.material.trim(),
    outcome: answers.outcome.trim(),
    competency: answers.competency.trim(),
    delivery: answers.delivery.trim(),
    presence: answers.presence ? copy.presenceSentence[answers.presence] : '',
    constraints: joinChips(answers.constraints, answers.constraintsOther, CONSTRAINT_OPTIONS, NOTHING_CONSTRAINT),
    barriers: joinChips(answers.barriers, answers.barriersOther, BARRIER_OPTIONS, NO_BARRIERS),
  };
  // Never leave an empty string: substitute the "ask me" line instead (§5.3).
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, value || copy.askFallback[key as Placeholder]]),
  ) as Record<Placeholder, string>;
}

/** Single pass, so braces inside the user's own text are never re-interpreted. */
export function interpolate(template: string, values: Record<Placeholder, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in values ? values[key as Placeholder] : match,
  );
}

export function promptBody(template: PromptTemplate, answers: Answers): string {
  const parts = [template.base];

  if (template.lenses) {
    for (const lens of lensesFor(answers.kind)) {
      const lensText = template.lenses[lens];
      if (lensText) parts.push(lensText);
    }
    if (answers.kind === 'both' || answers.kind === null) parts.push(MERGE_INSTRUCTION);
  }

  if (template.id === 'p3' && effectivePresence(answers) === 'standalone') parts.push(STANDALONE_P3_LINE);

  return parts.join('\n\n');
}

export function assemblePrompt(id: PromptId, answers: Answers): string {
  const template = PROMPTS[id];
  const full = [PREAMBLE, promptBody(template, answers), CLOSING].join('\n\n');
  return interpolate(full, placeholderValues(answers));
}

export interface AssembledPrompt {
  recommendation: Recommendation;
  template: PromptTemplate;
  text: string;
}

export function assembleAll(answers: Answers): AssembledPrompt[] {
  return recommend(answers).map((recommendation) => ({
    recommendation,
    template: PROMPTS[recommendation.promptId],
    text: assemblePrompt(recommendation.promptId, answers),
  }));
}
