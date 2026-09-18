import { copy } from '../../content/copy';

/** Verbatim from the pack. Shown on results for every user, in every state. */
export function StopAndRefer({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  const { title, lede, items } = copy.stopAndRefer;
  return (
    <section aria-labelledby="stop-and-refer" className="mt-10 rounded-xl bg-amber p-5 text-white sm:p-6">
      <Heading id="stop-and-refer" className="mb-2 text-xl font-bold text-white">
        {title}
      </Heading>
      <p className="mb-3">{lede}</p>
      <ul className="list-disc space-y-2 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
