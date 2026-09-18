import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const AnnounceContext = createContext<(message: string) => void>(() => {});

/** One polite live region for the whole app: step changes and copy confirmations. */
export function LiveRegionProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const timer = useRef<number>();

  const announce = useCallback((next: string) => {
    // Clear first so repeating the same message is still announced.
    setMessage('');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(next), 60);
  }, []);

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
    </AnnounceContext.Provider>
  );
}

export const useAnnounce = () => useContext(AnnounceContext);
