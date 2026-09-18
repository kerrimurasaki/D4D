import { Link, Route, Routes } from 'react-router-dom';
import { copy } from './content/copy';
import { LandingPage } from './pages/LandingPage';
import { AllPromptsPage } from './pages/AllPromptsPage';
import { InterviewPage } from './components/Interview/InterviewPage';
import { ResultsPage } from './components/Results/ResultsPage';
import { usePageSetup } from './components/ui/usePageSetup';
import { ButtonLink } from './components/ui/Button';

function NotFound() {
  const headingRef = usePageSetup(copy.titles.notFound);
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold">
        {copy.notFound.title}
      </h1>
      <ButtonLink to="/" className="mt-6">
        {copy.notFound.home}
      </ButtonLink>
    </div>
  );
}

export function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {copy.skipLink}
      </a>
      <header className="border-b-4 border-amber-bright bg-deep">
        <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
          <Link to="/" className="on-dark inline-flex min-h-12 items-center gap-2 font-serif text-lg font-bold text-sand no-underline">
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-sand text-xs text-deep">
              ◐
            </span>
            {copy.appName}
          </Link>
        </div>
      </header>
      <main id="main" className="flex-1 pb-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interview/:step" element={<InterviewPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/prompts" element={<AllPromptsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const { prefix, name, url } = copy.footer;
  return (
    <footer className="border-t border-line px-4 py-6 text-center text-sm text-mute">
      {prefix}{' '}
      <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-deep underline decoration-2 underline-offset-4">
        {name}
      </a>
    </footer>
  );
}
