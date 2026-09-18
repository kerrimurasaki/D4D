import { Link } from 'react-router-dom';
import { PROMPTS, ROUTING_PROMPT, type PromptTemplate } from '../content/prompts';
import { copy } from '../content/copy';
import { usePageSetup } from '../components/ui/usePageSetup';
import { StopAndRefer } from '../components/ui/StopAndRefer';

function PromptBlock({
  number,
  title,
  tagline,
  intro,
  packText,
  lenses,
}: Pick<PromptTemplate, 'number' | 'title' | 'tagline' | 'intro' | 'packText' | 'lenses'>) {
  const { pack } = copy;
  return (
    <article aria-labelledby={`pack-${number}`} className="rounded-xl bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-deep font-bold text-white"
        >
          {number}
        </span>
        <h3 id={`pack-${number}`} className="text-xl font-bold">
          <span className="sr-only">Prompt {number}: </span>
          {title}
        </h3>
        <span className="italic text-mute sm:ml-auto">{tagline}</span>
      </div>
      {intro && <p className="mt-3 text-sm text-mute">{intro}</p>}
      <pre tabIndex={0} aria-label={`Prompt ${number}, ${title}`} className="prompt-body mt-4 overflow-x-auto">
        {packText}
      </pre>
      {lenses?.text && (
        <>
          <p className="mt-4">
            <span className="lens-tag bg-sage">{pack.textLens}</span> {pack.textLensAdd}
          </p>
          <pre tabIndex={0} aria-label={`Prompt ${number}, ${pack.textLens}`} className="prompt-body mt-2 overflow-x-auto">
            {lenses.text}
          </pre>
        </>
      )}
      {lenses?.procedural && (
        <>
          <p className="mt-4">
            <span className="lens-tag bg-clay">{pack.procLens}</span> {pack.procLensAdd}
          </p>
          <pre tabIndex={0} aria-label={`Prompt ${number}, ${pack.procLens}`} className="prompt-body mt-2 overflow-x-auto">
            {lenses.procedural}
          </pre>
        </>
      )}
    </article>
  );
}

export function AllPromptsPage() {
  const headingRef = usePageSetup(copy.titles.prompts);
  const { pack } = copy;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <header className="border-b-4 border-amber-bright pb-4">
        <p className="kicker">{pack.kicker}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">
          {pack.title}
        </h1>
        <p className="mt-2 italic text-mute">{pack.sub}</p>
      </header>

      <div className="mt-6 rounded-xl bg-tint p-5">
        <p>
          <strong>{pack.whyTitle}</strong> {pack.why}
        </p>
        <p className="mt-3">
          <strong>{pack.neverTitle}</strong> {pack.never}
        </p>
      </div>

      <p className="mt-5 rounded-lg border-2 border-deep bg-white px-4 py-3">
        {pack.appCallout}{' '}
        <Link to="/interview/1" className="font-semibold text-deep underline decoration-2 underline-offset-4">
          {pack.appCalloutLink}
        </Link>
      </p>

      <h2 className="section-heading">{pack.startHere}</h2>
      <PromptBlock {...ROUTING_PROMPT} />

      <h2 className="section-heading">{pack.coreTitle}</h2>
      <p className="-mt-2 mb-4 text-mute">{pack.coreLede}</p>
      <div className="space-y-5">
        {[PROMPTS.p1, PROMPTS.p2, PROMPTS.p3, PROMPTS.p4, PROMPTS.p5, PROMPTS.p6].map((p) => (
          <PromptBlock key={p.id} {...p} />
        ))}
      </div>

      <h2 className="section-heading">{pack.readyTitle}</h2>
      <p className="-mt-2 mb-4 text-mute">{pack.readyLede}</p>
      <div className="overflow-x-auto rounded-xl bg-white shadow-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-deep text-white">
              <th scope="col" className="px-4 py-3 text-sm uppercase tracking-wider">
                {pack.tableNeed}
              </th>
              <th scope="col" className="px-4 py-3 text-sm uppercase tracking-wider">
                {pack.tableWhy}
              </th>
            </tr>
          </thead>
          <tbody>
            {copy.preflight.map(([need, why]) => (
              <tr key={need} className="border-t border-line align-top">
                <th scope="row" className="w-1/3 px-4 py-3 font-bold text-deep">
                  {need}
                </th>
                <td className="px-4 py-3">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StopAndRefer />

      <p className="mt-8 border-t border-line pt-4 text-sm text-mute">{copy.disclaimer}</p>
    </div>
  );
}
