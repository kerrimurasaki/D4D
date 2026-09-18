import { useState } from 'react';
import type { AssembledPrompt } from '../../lib/assemble';
import { copy } from '../../content/copy';
import { StatusPill } from '../ui/StatusPill';
import { Button } from '../ui/Button';
import { CopyButton } from './CopyButton';

export function PromptCard({ item, position }: { item: AssembledPrompt; position: number }) {
  const { template, recommendation, text } = item;
  const [open, setOpen] = useState(false);
  const bodyId = `prompt-body-${template.id}`;
  const headingId = `prompt-heading-${template.id}`;
  const label = copy.results.promptLabel(template.number, template.title);

  return (
    <li>
      <article aria-labelledby={headingId} className="rounded-xl bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-sm font-semibold text-mute">{copy.results.stepLabel(position)}</span>
          <StatusPill status={recommendation.status} />
        </div>

        <div className="mt-3 flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-deep font-bold text-white"
          >
            {template.number}
          </span>
          <div>
            <h2 id={headingId} className="text-xl font-bold leading-tight">
              <span className="sr-only">Prompt {template.number}: </span>
              {template.title}
            </h2>
            <p className="italic text-mute">{template.tagline}</p>
          </div>
        </div>

        <p className="mt-4">
          <strong className="text-deep">{copy.results.why}</strong> {recommendation.reason}
        </p>

        {template.intro && <p className="mt-3 border-l-4 border-line pl-3 text-sm text-mute">{template.intro}</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          <CopyButton text={text} srSuffix={label} announcement={copy.results.announceCopied(label)}>
            {copy.results.copyPrompt}
          </CopyButton>
          <Button variant="secondary" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
            <span aria-hidden="true">{open ? '▾' : '▸'}</span>
            {open ? copy.results.hidePrompt : copy.results.showPrompt}
            <span className="sr-only"> {label}</span>
          </Button>
        </div>

        <pre id={bodyId} hidden={!open} tabIndex={0} aria-label={label} className="prompt-body mt-4 max-h-[28rem] overflow-auto">
          {text}
        </pre>
      </article>
    </li>
  );
}
