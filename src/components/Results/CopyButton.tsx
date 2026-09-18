import { useEffect, useRef, useState, type ReactNode } from 'react';
import { copyText } from '../../lib/clipboard';
import { copy } from '../../content/copy';
import { useAnnounce } from '../ui/LiveRegion';
import { Button, type ButtonVariant } from '../ui/Button';

interface CopyButtonProps {
  text: string;
  /** Visible label. */
  children: ReactNode;
  /** Extra words for screen readers so repeated buttons are distinguishable. */
  srSuffix?: string;
  doneLabel?: string;
  announcement: string;
  variant?: ButtonVariant;
  className?: string;
}

export function CopyButton({
  text,
  children,
  srSuffix,
  doneLabel = copy.results.copied,
  announcement,
  variant = 'primary',
  className,
}: CopyButtonProps) {
  const announce = useAnnounce();
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async () => {
    const ok = await copyText(text);
    setState(ok ? 'done' : 'failed');
    announce(ok ? announcement : copy.results.announceCopyFailed);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), ok ? 2200 : 4000);
  };

  return (
    <Button variant={variant} onClick={handleClick} className={className}>
      {state === 'done' ? (
        <>
          <span aria-hidden="true">✓</span> {doneLabel}
        </>
      ) : state === 'failed' ? (
        copy.results.copyFailed
      ) : (
        <>
          {children}
          {srSuffix && <span className="sr-only"> {srSuffix}</span>}
        </>
      )}
    </Button>
  );
}
