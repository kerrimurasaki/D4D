import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AnswersProvider } from './state/AnswersContext';
import { LiveRegionProvider } from './components/ui/LiveRegion';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AnswersProvider>
        <LiveRegionProvider>
          <App />
        </LiveRegionProvider>
      </AnswersProvider>
    </BrowserRouter>
  </StrictMode>,
);
