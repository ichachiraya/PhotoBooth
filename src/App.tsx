import { useState } from 'react';
import type { Step } from './types';
import { PageShell } from './components/layout/PageShell';
import { LanguageToggle } from './components/ui/LanguageToggle';
import { Button } from './components/ui/Button';
import { useI18n } from './i18n/useI18n';

const STEP_ORDER: Step[] = ['template', 'capture', 'edit', 'save'];

/**
 * Top-level step router. Each step is a placeholder here; milestones
 * (b)-(f) replace these bodies with the real template picker, camera
 * capture, editor, and save screens while keeping this shell in place.
 */
function App() {
  const [step, setStep] = useState<Step>('template');
  const { t } = useI18n();

  const index = STEP_ORDER.indexOf(step);
  const goNext = () => setStep(STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)]!);
  const goBack = () => setStep(STEP_ORDER[Math.max(index - 1, 0)]!);

  return (
    <PageShell step={step} headerActions={<LanguageToggle />}>
      <h1 className="text-center font-serif text-2xl">{t.appName}</h1>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[var(--radius-md)] border border-line bg-surface p-8 text-center">
        <p className="text-text-secondary">Step: {t.steps[step]}</p>
      </div>

      <div className="flex justify-between gap-3">
        <Button variant="secondary" onClick={goBack} disabled={index === 0}>
          {t.common.back}
        </Button>
        <Button variant="primary" onClick={goNext} disabled={index === STEP_ORDER.length - 1}>
          {t.common.next}
        </Button>
      </div>
    </PageShell>
  );
}

export default App;
