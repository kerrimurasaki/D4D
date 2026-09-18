import { emptyAnswers, type Answers } from './answers';

const STORAGE_KEY = 'design-for-variability:answers:v1';

const KINDS = ['text', 'procedural', 'both'];
const SEQUENCES = ['yes', 'no', 'not-sure'];
const PRESENCES = ['present', 'standalone', 'mixed'];

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const strArray = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const oneOf = <T extends string>(v: unknown, allowed: string[]) => (allowed.includes(v as string) ? (v as T) : null);

/** Restore answers, discarding anything malformed. Storage can be unavailable; never throw. */
export function loadAnswers(): Answers {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAnswers;
    const data = JSON.parse(raw) as Record<string, unknown>;
    return {
      material: str(data.material),
      kind: oneOf(data.kind, KINDS),
      sequence: oneOf(data.sequence, SEQUENCES),
      outcome: str(data.outcome),
      competency: str(data.competency),
      delivery: str(data.delivery),
      presence: oneOf(data.presence, PRESENCES),
      constraints: strArray(data.constraints),
      constraintsOther: str(data.constraintsOther),
      barriers: strArray(data.barriers),
      barriersOther: str(data.barriersOther),
    };
  } catch {
    return emptyAnswers;
  }
}

export function saveAnswers(answers: Answers): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // Private mode or storage full: the app still works, it just won't survive a refresh.
  }
}

export function clearAnswers(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasProgress(answers: Answers): boolean {
  return JSON.stringify(answers) !== JSON.stringify(emptyAnswers);
}
