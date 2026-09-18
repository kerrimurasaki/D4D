/**
 * Advisory privacy guard (PRD §4). Client-side only, never blocking, never logged.
 * Deliberately a small list: it nudges, it doesn't police. Barrier words used in the
 * interview's own chips ("vision", "hearing") are not included.
 */

// Matched case-insensitively on word boundaries.
const PHRASES = [
  'diagnosed',
  'diagnosis',
  'has a statement of',
  'statement of special educational needs',
  'special educational needs',
  'special needs',
  'learning disability',
  'learning difficulty',
  'autism',
  'autistic',
  'asperger',
  'aspergers',
  "asperger's",
  'dyslexia',
  'dyslexic',
  'dyspraxia',
  'dyspraxic',
  'dyscalculia',
  'dysgraphia',
  'attention deficit',
  'epilepsy',
  'epileptic',
  'cerebral palsy',
  'down syndrome',
  "down's syndrome",
  'tourette',
  "tourette's",
  'bipolar',
  'schizophrenia',
  'schizophrenic',
  'obsessive compulsive',
  'anxiety disorder',
  'clinical depression',
  'on medication',
  'on the spectrum',
  'visually impaired student',
  'deaf student',
  'blind student',
  'wheelchair user',
];

// Acronyms, matched case-sensitively so ordinary words ("add", "sen") don't trigger.
const ACRONYMS = ['IEP', 'EHCP', 'ADHD', 'ADD', 'ASD', 'ASC', 'SEN', 'SEND', 'SpLD', 'OCD', 'PTSD', 'ODD', '504 plan'];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const phrasePattern = new RegExp(`\\b(?:${PHRASES.map(escape).join('|')})\\b`, 'i');
const acronymPattern = new RegExp(`\\b(?:${ACRONYMS.map(escape).join('|')})\\b`);

export function containsSensitiveTerms(text: string): boolean {
  if (!text.trim()) return false;
  return phrasePattern.test(text) || acronymPattern.test(text);
}
