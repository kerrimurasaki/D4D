import { Link, useNavigate } from 'react-router-dom';
import { copy } from '../content/copy';
import { useAnswers } from '../state/AnswersContext';
import { hasProgress } from '../lib/storage';
import { usePageSetup } from '../components/ui/usePageSetup';
import { Button, ButtonLink } from '../components/ui/Button';

export function LandingPage() {
  const { answers, reset } = useAnswers();
  const navigate = useNavigate();
  const headingRef = usePageSetup(copy.titles.landing);
  const { landing } = copy;
  const resumable = hasProgress(answers);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6 sm:px-6 sm:pt-12">
      <p className="kicker">{landing.kicker}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">
        {landing.title}
      </h1>
      <p className="mt-3 text-lg">{landing.lede}</p>

      <p className="mt-4 flex items-start gap-2 rounded-lg bg-tint px-4 py-3 font-semibold text-deep">
        <span aria-hidden="true">🔒</span>
        {landing.privacy}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ButtonLink to="/interview/1" className="px-8 text-lg">
          {resumable ? landing.resume : landing.start} <span aria-hidden="true">→</span>
        </ButtonLink>
        <span className="text-mute">
          <span aria-hidden="true">⏱ </span>
          {landing.time}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4">
        <Link
          to="/prompts"
          className="inline-flex min-h-11 items-center font-semibold text-deep underline decoration-2 underline-offset-4"
        >
          {landing.allPrompts}
        </Link>
        {resumable && (
          <Button
            variant="quiet"
            onClick={() => {
              if (window.confirm(copy.interview.confirmStartOver)) {
                reset();
                navigate('/interview/1');
              }
            }}
          >
            {landing.startOver}
          </Button>
        )}
      </div>

      <section aria-labelledby="need-heading" className="mt-10 rounded-xl bg-white p-5 shadow-card sm:p-6">
        <h2 id="need-heading" className="text-xl font-bold">
          {landing.needTitle}
        </h2>
        <p className="mt-1 text-mute">{landing.needLede}</p>
        <ul className="mt-4 divide-y divide-line">
          {copy.preflight.map(([need, why]) => (
            <li key={need} className="py-3">
              <strong className="block text-deep">{need}</strong>
              <span className="text-ink">{why}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
