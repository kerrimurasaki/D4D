import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { assembleAll } from '../../lib/assemble';
import { skippedAnswers } from '../../lib/router';
import { copyAllText, markdownExport } from '../../lib/export';
import { downloadFile } from '../../lib/clipboard';
import { downloadPdf } from '../../lib/pdf';
import { firstIncompleteStep } from '../../lib/validation';
import { questionForStep } from '../../content/questions';
import { copy } from '../../content/copy';
import { useAnswers } from '../../state/AnswersContext';
import { useAnnounce } from '../ui/LiveRegion';
import { usePageSetup } from '../ui/usePageSetup';
import { Button, ButtonLink } from '../ui/Button';
import { StopAndRefer } from '../ui/StopAndRefer';
import { PromptCard } from './PromptCard';
import { CopyButton } from './CopyButton';
import { AnswersSummary } from './AnswersSummary';

export function ResultsPage() {
  const { answers } = useAnswers();
  const incomplete = firstIncompleteStep(answers);
  const headingRef = usePageSetup(copy.titles.results);

  // Re-assembles live whenever an answer changes.
  const items = useMemo(() => assembleAll(answers), [answers]);
  const skipped = skippedAnswers(answers);

  if (incomplete !== null) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <div className="rounded-xl bg-white p-6 shadow-card">
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold">
            {copy.results.incompleteTitle}
          </h1>
          <p className="mt-2">{copy.results.incompleteBody}</p>
          <ButtonLink to={`/interview/${incomplete}`} className="mt-5">
            {copy.results.incompleteLink(questionForStep(incomplete).name)}
          </ButtonLink>
        </div>
        <StopAndRefer />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 pb-40 pt-8 sm:px-6">
        <p className="kicker">{copy.results.kicker}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">
          {copy.results.title}
        </h1>
        <p className="mt-3 text-lg">{copy.results.intro}</p>

        {skipped.length > 0 && (
          <div className="mt-5 rounded-lg bg-tint p-4">
            <p className="font-semibold text-deep">{copy.results.skipped(skipped.length)}</p>
            <ul className="mt-2 space-y-1">
              {skipped.map(({ key, step }) => (
                <li key={key} className="flex flex-wrap items-center gap-x-2">
                  <span>{copy.skippedNames[key]}</span>
                  <Link
                    to={`/interview/${step}`}
                    className="inline-flex min-h-11 items-center px-1 font-semibold text-deep underline decoration-2 underline-offset-4"
                  >
                    {copy.results.skippedEdit}
                    <span className="sr-only">: {copy.skippedNames[key]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ol className="mt-8 space-y-5" aria-label="Prompts to run, in order">
          {items.map((item, i) => (
            <PromptCard key={item.template.id} item={item} position={i + 1} />
          ))}
        </ol>

        <StopAndRefer />

        <AnswersSummary />

        <p className="mt-8">
          <Link to="/prompts" className="font-semibold text-deep underline decoration-2 underline-offset-4">
            {copy.results.allPromptsLink}
          </Link>
        </p>
        <p className="mt-6 border-t border-line pt-4 text-sm text-mute">{copy.disclaimer}</p>
      </div>

      <ResultsActions items={items} />
    </>
  );
}

function ResultsActions({ items }: { items: ReturnType<typeof assembleAll> }) {
  const announce = useAnnounce();
  const [busy, setBusy] = useState(false);

  // Keeps the site footer clear of the fixed bar while this page is open.
  useEffect(() => {
    document.documentElement.classList.add('has-action-bar');
    return () => document.documentElement.classList.remove('has-action-bar');
  }, []);

  return (
    <section
      aria-label={copy.results.actionsLabel}
      className="on-dark fixed inset-x-0 bottom-0 z-10 bg-deep px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-card"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
        <CopyButton
          text={copyAllText(items)}
          variant="onDark"
          className="px-2 text-sm sm:text-base"
          doneLabel={copy.results.copyAllDone}
          announcement={copy.results.announceCopyAll(items.length)}
        >
          {copy.results.copyAll}
        </CopyButton>
        <Button
          variant="onDark"
          className="px-2 text-sm sm:text-base"
          onClick={() => {
            downloadFile(copy.export.fileName, markdownExport(items));
            announce(copy.results.announceDownload);
          }}
        >
          {copy.results.download}
        </Button>
        <Button
          variant="onDark"
          className="px-2 text-sm sm:text-base"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await downloadPdf(items);
              announce(copy.results.announceDownloadPdf);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? copy.results.preparingPdf : copy.results.downloadPdf}
        </Button>
        <ButtonLink to="/interview/1" variant="onDark" className="px-2 text-center text-sm sm:text-base">
          {copy.results.editAnswers}
        </ButtonLink>
      </div>
    </section>
  );
}
