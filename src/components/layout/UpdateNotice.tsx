import { usePwaUpdate } from '../../hooks/usePwaUpdate';
import { useI18n } from '../../i18n/useI18n';

/**
 * A small, minimal "New version available · Refresh" line shown once a
 * new deploy has installed in the background. Deliberately not a toast
 * or a forced reload: an in-progress capture (camera running, unsaved
 * photos) must never be interrupted, so this just waits, inline, for the
 * person to tap Refresh when it's a good time.
 */
export function UpdateNotice() {
  const { needRefresh, refresh } = usePwaUpdate();
  const { t } = useI18n();

  if (!needRefresh) return null;

  return (
    <div role="status" className="mx-auto w-full max-w-[480px] px-4">
      <p className="mt-3 rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-center text-sm text-text">
        {t.common.newVersionAvailable}
        <span className="mx-2 text-text-secondary">·</span>
        <button
          type="button"
          onClick={refresh}
          className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          {t.common.refresh}
        </button>
      </p>
    </div>
  );
}
