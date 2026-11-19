import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Red Hat Display (variable weight, with its italic): the headings, set large and light.
// Red Hat Text (variable weight): reading text and the small labels.
// Red Hat Mono (variable weight): figures — fees and times at the desk.
import '@fontsource-variable/red-hat-display/wght.css';
import '@fontsource-variable/red-hat-display/wght-italic.css';
import '@fontsource-variable/red-hat-text/wght.css';
import '@fontsource-variable/red-hat-mono/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/booking.css';
import { App } from './App';
import { engine } from './lib/engine';
import type { DemoEngine } from './demo/engine';

if (__BOOKING_DEMO__) void import('./demo/engine/DemoBar').then((m) => m.mountDemoBar(engine as DemoEngine, 'site'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
