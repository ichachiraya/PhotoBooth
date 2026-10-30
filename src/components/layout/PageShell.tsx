import type { ReactNode } from 'react';
import type { Step } from '../../types';
import { StepIndicator } from './StepIndicator';
import { FloralBackground } from './FloralBackground';
import { UpdateNotice } from './UpdateNotice';
import { useI18n } from '../../i18n/useI18n';

interface PageShellProps {
  step: Step;
  children: ReactNode;
  headerActions?: ReactNode;
}

/**
 * Shared page frame: floral background, step indicator, narrow centered
 * column, privacy note footer. Every screen in the flow renders inside this.
 */
export function PageShell({ step, children, headerActions }: PageShellProps) {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen flex-col">
      <FloralBackground />

      <header className="flex items-center justify-between gap-4 px-4 pt-6">
        <div className="w-10" />
        <StepIndicator current={step} />
        <div className="flex w-10 justify-end">{headerActions}</div>
      </header>

      <UpdateNotice />

      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-6 px-4 py-8">
        {children}
      </main>

      <footer className="px-4 pb-6 text-center">
        <p className="text-xs text-text-secondary">{t.privacyNote}</p>
      </footer>
    </div>
  );
}
