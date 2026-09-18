import { Link } from 'react-router-dom';
import type { Answers } from '../../lib/answers';
import {
  BARRIER_OPTIONS,
  CONSTRAINT_OPTIONS,
  KIND_OPTIONS,
  PRESENCE_OPTIONS,
  QUESTIONS,
  SEQUENCE_OPTIONS,
  type Option,
} from '../../content/questions';
import { copy } from '../../content/copy';
import { useAnswers } from '../../state/AnswersContext';

const labelOf = (options: Option<string>[], value: string | null) => options.find((o) => o.value === value)?.label ?? '';
const chips = (options: Option<string>[], ids: string[], other: string) =>
  [...options.filter((o) => ids.includes(o.value)).map((o) => o.label), other.trim()].filter(Boolean).join(', ');

function summaries(a: Answers): string[] {
  const split = [
    a.competency.trim() && `${copy.interview.competencyLabel}: ${a.competency.trim()}`,
    a.delivery.trim() && `${copy.interview.deliveryLabel}: ${a.delivery.trim()}`,
  ]
    .filter(Boolean)
    .join(' · ');
  return [
    a.material.trim().length > 160 ? `${a.material.trim().slice(0, 160)}…` : a.material.trim(),
    labelOf(KIND_OPTIONS, a.kind),
    labelOf(SEQUENCE_OPTIONS, a.sequence),
    a.outcome.trim(),
    split,
    labelOf(PRESENCE_OPTIONS, a.presence),
    chips(CONSTRAINT_OPTIONS, a.constraints, a.constraintsOther),
    chips(BARRIER_OPTIONS, a.barriers, a.barriersOther),
  ];
}

/** Every answer with a link back to its step — the prompts above re-assemble when anything changes. */
export function AnswersSummary() {
  const { answers } = useAnswers();
  const values = summaries(answers);
  return (
    <section aria-labelledby="answers-heading" className="mt-10 rounded-xl bg-white p-5 shadow-card sm:p-6">
      <h2 id="answers-heading" className="text-xl font-bold">
        {copy.results.answersTitle}
      </h2>
      <p className="mt-1 text-mute">{copy.results.answersHint}</p>
      <dl className="mt-4 divide-y divide-line">
        {QUESTIONS.map((q, i) => (
          <div key={q.step} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-3">
            <dt className="col-start-1 text-sm font-semibold text-deep">{q.name}</dt>
            <dd className={`col-start-1 mt-0.5 break-words ${values[i] ? 'text-ink' : 'italic text-mute'}`}>
              {values[i] || copy.results.notAnswered}
            </dd>
            <dd className="col-start-2 row-span-2 row-start-1">
              <Link
                to={`/interview/${q.step}`}
                className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-semibold text-deep underline decoration-2 underline-offset-4"
              >
                {copy.results.edit}
                <span className="sr-only">: {q.name}</span>
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
