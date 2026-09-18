import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { emptyAnswers, type Answers } from '../lib/answers';
import { clearAnswers, loadAnswers, saveAnswers } from '../lib/storage';

type Action = { type: 'update'; patch: Partial<Answers> } | { type: 'reset' };

function reducer(state: Answers, action: Action): Answers {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.patch };
    case 'reset':
      return emptyAnswers;
  }
}

interface AnswersContextValue {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  reset: () => void;
}

const AnswersContext = createContext<AnswersContextValue | null>(null);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, dispatch] = useReducer(reducer, undefined, loadAnswers);

  useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  const value = useMemo<AnswersContextValue>(
    () => ({
      answers,
      update: (patch) => dispatch({ type: 'update', patch }),
      reset: () => {
        clearAnswers();
        dispatch({ type: 'reset' });
      },
    }),
    [answers],
  );

  return <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>;
}

export function useAnswers(): AnswersContextValue {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error('useAnswers must be used inside AnswersProvider');
  return ctx;
}
