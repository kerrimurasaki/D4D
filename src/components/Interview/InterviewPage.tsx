import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { TOTAL_STEPS, emptyAnswers, type Answers } from '../../lib/answers';
import { firstIncompleteStep, validateStep } from '../../lib/validation';
import { questionForStep } from '../../content/questions';
import { copy } from '../../content/copy';
import { useAnswers } from '../../state/AnswersContext';
import { useAnnounce } from '../ui/LiveRegion';
import { usePageSetup } from '../ui/usePageSetup';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { StepFields } from './StepFields';

export function InterviewPage() {
  const params = useParams();
  const step = Number(params.step);
  if (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS) return <Navigate to="/interview/1" replace />;
  // Keyed by step so per-step UI state (errors, dismissed nudges) resets between questions.
  return <InterviewStep key={step} step={step} />;
}

function InterviewStep({ step }: { step: number }) {
  const navigate = useNavigate();
  const announce = useAnnounce();
  const { answers, update, reset } = useAnswers();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const question = questionForStep(step);
  const headingRef = usePageSetup(copy.titles.step(step, TOTAL_STEPS, question.name), `step-${step}`);

  useEffect(() => {
    announce(copy.interview.announce(step, TOTAL_STEPS, question.name));
  }, [announce, step, question.name]);

  // Clear the error as soon as the answer becomes valid.
  useEffect(() => {
    if (error && !validateStep(step, answers)) setError(null);
  }, [answers, error, step]);

  const goNext = () => navigate(step === TOTAL_STEPS ? '/results' : `/interview/${step + 1}`);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const problem = validateStep(step, answers);
    if (problem) {
      setError(problem);
      formRef.current?.querySelector<HTMLElement>('textarea, input')?.focus();
      return;
    }
    goNext();
  };

  const handleSkip = () => {
    const cleared = Object.fromEntries(question.fields.map((f) => [f, emptyAnswers[f]])) as Partial<Answers>;
    update(cleared);
    goNext();
  };

  const handleStartOver = () => {
    if (window.confirm(copy.interview.confirmStartOver)) {
      reset();
      navigate('/');
    }
  };

  const canSeeResults = firstIncompleteStep(answers) === null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6 sm:px-6">
      <ProgressBar current={step} total={TOTAL_STEPS} name={question.name} />

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="rounded-xl bg-white p-5 shadow-card sm:p-7">
        <StepFields step={step} answers={answers} update={update} error={error} headingRef={headingRef} />

        <div className="mt-8 border-t border-line pt-5">
          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => navigate(step === 1 ? '/' : `/interview/${step - 1}`)}>
              <span aria-hidden="true">←</span> {copy.interview.back}
            </Button>
            <Button type="submit">
              {step === TOTAL_STEPS ? copy.interview.seeResults : copy.interview.next} <span aria-hidden="true">→</span>
            </Button>
          </div>
          {!question.required && (
            <div className="mt-2 flex justify-end">
              <Button variant="quiet" onClick={handleSkip}>
                {copy.interview.skip}
              </Button>
            </div>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {canSeeResults && step !== TOTAL_STEPS ? (
          <Link to="/results" className="font-semibold text-deep underline decoration-2 underline-offset-4">
            {copy.interview.backToResults}
          </Link>
        ) : (
          <span />
        )}
        <Button variant="quiet" onClick={handleStartOver}>
          {copy.interview.startOver}
        </Button>
      </div>
    </div>
  );
}
