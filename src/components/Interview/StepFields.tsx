import { useRef, useState, type ChangeEvent, type ReactNode, type RefObject } from 'react';
import type { Answers } from '../../lib/answers';
import { isVagueOutcome } from '../../lib/validation';
import {
  BARRIER_OPTIONS,
  CONSTRAINT_OPTIONS,
  KIND_OPTIONS,
  MATERIAL_PLACEHOLDER,
  PRESENCE_OPTIONS,
  SEQUENCE_OPTIONS,
  questionForStep,
  type Option,
} from '../../content/questions';
import { copy } from '../../content/copy';
import { OptionCard } from '../ui/OptionCard';
import { Chip } from '../ui/Chip';
import { PrivacyNotice } from '../ui/PrivacyNotice';
import { Button } from '../ui/Button';

export interface StepFieldsProps {
  step: number;
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  error: string | null;
  headingRef: RefObject<HTMLHeadingElement>;
}

const inputClass =
  'block w-full rounded-lg border-2 border-mute bg-white px-4 py-3 text-base text-ink placeholder:text-mute aria-[invalid=true]:border-amber';

function Heading({ step, headingRef }: Pick<StepFieldsProps, 'step' | 'headingRef'>) {
  const q = questionForStep(step);
  return (
    <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold leading-tight sm:text-3xl">
      {q.question}
    </h1>
  );
}

function Helper({ id, children, prominent = false }: { id: string; children: ReactNode; prominent?: boolean }) {
  return (
    <p
      id={id}
      className={
        prominent
          ? 'mt-3 rounded-lg border-l-4 border-deep bg-tint px-4 py-3 font-semibold text-deep'
          : 'mt-2 text-mute'
      }
    >
      {children}
    </p>
  );
}

function ErrorMessage({ id, error }: { id: string; error: string | null }) {
  // Always rendered so role="alert" is in the DOM before content arrives.
  return (
    <p id={id} role="alert" className="mt-2 font-semibold text-amber empty:hidden">
      {error ? `⚠ ${error}` : ''}
    </p>
  );
}

function RequirementNote({ step }: { step: number }) {
  const q = questionForStep(step);
  return <p className="mt-1 text-sm text-mute">{q.required ? copy.interview.required : copy.interview.optional}</p>;
}

function RadioStep<T extends string>({
  step,
  headingRef,
  name,
  options,
  value,
  onSelect,
  error,
}: Pick<StepFieldsProps, 'step' | 'headingRef' | 'error'> & {
  name: string;
  options: Option<T>[];
  value: T | null;
  onSelect: (v: T) => void;
}) {
  const q = questionForStep(step);
  const helperId = `${name}-helper`;
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={[q.helper ? helperId : '', errorId].filter(Boolean).join(' ')}>
      <legend className="w-full">
        <Heading step={step} headingRef={headingRef} />
      </legend>
      <RequirementNote step={step} />
      {q.helper && <Helper id={helperId}>{q.helper}</Helper>}
      <div className="mt-5 grid gap-3">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            hint={option.hint}
            checked={value === option.value}
            onChange={() => onSelect(option.value)}
            describedBy={error ? errorId : undefined}
          />
        ))}
      </div>
      <ErrorMessage id={errorId} error={error} />
    </fieldset>
  );
}

function ChipStep({
  step,
  headingRef,
  name,
  options,
  selected,
  other,
  otherLabel,
  onChange,
}: Pick<StepFieldsProps, 'step' | 'headingRef'> & {
  name: 'constraints' | 'barriers';
  options: Option<string>[];
  selected: string[];
  other: string;
  otherLabel: string;
  onChange: (patch: Partial<Answers>) => void;
}) {
  const q = questionForStep(step);
  const helperId = `${name}-helper`;
  const otherKey = name === 'constraints' ? 'constraintsOther' : 'barriersOther';
  const toggle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    onChange({ [name]: checked ? [...selected, value] : selected.filter((v) => v !== value) });
  };
  return (
    <>
      <fieldset aria-describedby={q.helper ? helperId : undefined}>
        <legend className="w-full">
          <Heading step={step} headingRef={headingRef} />
        </legend>
        <RequirementNote step={step} />
        {q.helper && (
          <Helper id={helperId} prominent={name === 'barriers'}>
            {q.helper}
          </Helper>
        )}
        <p className="mt-4 text-sm text-mute">{copy.interview.chipsLegendHint}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((option) => (
            <Chip
              key={option.value}
              name={name}
              value={option.value}
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={toggle}
            />
          ))}
        </div>
      </fieldset>
      <div className="mt-6">
        <label htmlFor={`${name}-other`} className="block font-semibold text-deep">
          {otherLabel}
        </label>
        <input
          id={`${name}-other`}
          type="text"
          className={`${inputClass} mt-2`}
          value={other}
          aria-describedby={name === 'barriers' ? helperId : undefined}
          onChange={(e) => onChange({ [otherKey]: e.target.value })}
        />
      </div>
      {name === 'barriers' && <PrivacyNotice texts={[other]} />}
    </>
  );
}

function OutcomeStep({ answers, update, error, headingRef }: Omit<StepFieldsProps, 'step'>) {
  const q = questionForStep(4);
  const inputRef = useRef<HTMLInputElement>(null);
  const [keptAnyway, setKeptAnyway] = useState<string | null>(null);
  const vague = isVagueOutcome(answers.outcome) && keptAnyway !== answers.outcome;
  return (
    <>
      <Heading step={4} headingRef={headingRef} />
      <RequirementNote step={4} />
      <label htmlFor="outcome" className="mt-5 block font-semibold text-deep">
        {copy.interview.outcomeLabel}
      </label>
      <Helper id="outcome-helper">{q.helper}</Helper>
      <input
        ref={inputRef}
        id="outcome"
        type="text"
        maxLength={140}
        className={`${inputClass} mt-3`}
        value={answers.outcome}
        aria-invalid={error ? true : undefined}
        aria-describedby="outcome-helper outcome-error outcome-count"
        onChange={(e) => update({ outcome: e.target.value })}
      />
      <p id="outcome-count" className="mt-1 text-right text-sm text-mute">
        {answers.outcome.length}/140
      </p>
      <ErrorMessage id="outcome-error" error={error} />
      {vague && (
        <div role="status" className="mt-3 rounded-lg border-l-4 border-amber-bright bg-white p-4 shadow-card">
          <p className="text-ink">{copy.interview.outcomeNudge}</p>
          <Button
            variant="quiet"
            className="mt-2 -ml-3"
            onClick={() => {
              setKeptAnyway(answers.outcome);
              inputRef.current?.focus();
            }}
          >
            {copy.interview.keepAnyway}
          </Button>
        </div>
      )}
    </>
  );
}

export function StepFields(props: StepFieldsProps) {
  const { step, answers, update, error, headingRef } = props;
  const q = questionForStep(step);

  switch (step) {
    case 1:
      return (
        <>
          <Heading step={1} headingRef={headingRef} />
          <RequirementNote step={1} />
          <label htmlFor="material" className="mt-5 block font-semibold text-deep">
            {copy.interview.materialLabel}
          </label>
          <Helper id="material-helper">
            <span aria-hidden="true">🔒 </span>
            {q.helper}
          </Helper>
          <textarea
            id="material"
            rows={9}
            className={`${inputClass} mt-3 font-sans`}
            placeholder={MATERIAL_PLACEHOLDER}
            value={answers.material}
            aria-invalid={error ? true : undefined}
            aria-describedby="material-helper material-error"
            onChange={(e) => update({ material: e.target.value })}
          />
          <ErrorMessage id="material-error" error={error} />
          <PrivacyNotice texts={[answers.material]} />
        </>
      );
    case 2:
      return (
        <RadioStep
          step={2}
          headingRef={headingRef}
          name="kind"
          options={KIND_OPTIONS}
          value={answers.kind}
          onSelect={(kind) => update({ kind })}
          error={error}
        />
      );
    case 3:
      return (
        <RadioStep
          step={3}
          headingRef={headingRef}
          name="sequence"
          options={SEQUENCE_OPTIONS}
          value={answers.sequence}
          onSelect={(sequence) => update({ sequence })}
          error={null}
        />
      );
    case 4:
      return <OutcomeStep {...props} />;
    case 5:
      return (
        <>
          <Heading step={5} headingRef={headingRef} />
          <RequirementNote step={5} />
          <Helper id="split-helper">{q.helper}</Helper>
          <div className="mt-6">
            <label htmlFor="competency" className="block font-semibold text-deep">
              {copy.interview.competencyLabel}
            </label>
            <p id="competency-hint" className="text-sm text-mute">
              {copy.interview.competencyHint}
            </p>
            <input
              id="competency"
              type="text"
              className={`${inputClass} mt-2`}
              value={answers.competency}
              aria-describedby="competency-hint split-helper"
              onChange={(e) => update({ competency: e.target.value })}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="delivery" className="block font-semibold text-deep">
              {copy.interview.deliveryLabel}
            </label>
            <p id="delivery-hint" className="text-sm text-mute">
              {copy.interview.deliveryHint}
            </p>
            <input
              id="delivery"
              type="text"
              className={`${inputClass} mt-2`}
              value={answers.delivery}
              aria-describedby="delivery-hint split-helper"
              onChange={(e) => update({ delivery: e.target.value })}
            />
          </div>
        </>
      );
    case 6:
      return (
        <RadioStep
          step={6}
          headingRef={headingRef}
          name="presence"
          options={PRESENCE_OPTIONS}
          value={answers.presence}
          onSelect={(presence) => update({ presence })}
          error={null}
        />
      );
    case 7:
      return (
        <ChipStep
          step={7}
          headingRef={headingRef}
          name="constraints"
          options={CONSTRAINT_OPTIONS}
          selected={answers.constraints}
          other={answers.constraintsOther}
          otherLabel={copy.interview.constraintsOtherLabel}
          onChange={update}
        />
      );
    case 8:
      return (
        <ChipStep
          step={8}
          headingRef={headingRef}
          name="barriers"
          options={BARRIER_OPTIONS}
          selected={answers.barriers}
          other={answers.barriersOther}
          otherLabel={copy.interview.barriersOtherLabel}
          onChange={update}
        />
      );
    default:
      return null;
  }
}
