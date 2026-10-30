import type { Step } from '../../types';
import { useI18n } from '../../i18n/useI18n';

const ORDER: Step[] = ['template', 'capture', 'edit', 'save'];

/**
 * Plain-text step indicator, e.g. "01 · Template  02 · Capture  03 · Edit  04 · Save",
 * deliberately not a colorful progress bar.
 */
export function StepIndicator({ current }: { current: Step }) {
  const { t } = useI18n();

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {ORDER.map((step, i) => {
          const isCurrent = step === current;
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className={`u-label flex items-center gap-1 ${
                isCurrent ? 'text-text' : 'text-text-secondary'
              }`}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>·</span>
              <span>{t.steps[step]}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
