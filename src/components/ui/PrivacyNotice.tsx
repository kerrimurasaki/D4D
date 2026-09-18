import { useState } from 'react';
import { containsSensitiveTerms } from '../../lib/privacyTerms';
import { copy } from '../../content/copy';
import { Button } from './Button';

/** Advisory only: never blocks, never logs. Reappears if dismissed text is later replaced by new text that matches. */
export function PrivacyNotice({ texts }: { texts: string[] }) {
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const joined = texts.join('\n');
  const matches = containsSensitiveTerms(joined);

  if (!matches || dismissedFor === joined) return null;

  return (
    <div role="status" className="mt-4 rounded-lg border-l-4 border-amber-bright bg-white p-4 shadow-card">
      <p className="text-ink">
        <strong className="text-amber">{copy.privacyGuard.title}</strong> {copy.privacyGuard.body}
      </p>
      <Button variant="quiet" className="mt-2 -ml-3" onClick={() => setDismissedFor(joined)}>
        {copy.privacyGuard.dismiss}
      </Button>
    </div>
  );
}
