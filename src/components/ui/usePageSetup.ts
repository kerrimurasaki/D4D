import { useEffect, useRef } from 'react';

/**
 * Sets the document title and moves focus to the view's <h1> whenever `key` changes,
 * so keyboard and screen reader users land at the top of each new view.
 */
export function usePageSetup(title: string, key: string = title) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [key]);

  return headingRef;
}
