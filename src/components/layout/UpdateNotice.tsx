import { useState } from 'react';
import { usePwaUpdate } from '../../hooks/usePwaUpdate';
import { useI18n } from '../../i18n/useI18n';

interface UpdateNoticeProps {
  /** When true, Refresh asks for confirmation first instead of reloading immediately. */
  hasUnsavedPhotos: boolean;
}

/**
 * A small, minimal "New version available · Refresh" line shown once a
 * new deploy has installed in the background. Deliberately not a toast
 * or a forced reload: an in-progress capture (camera running, unsaved
 * photos) must never be interrupted, so this just waits, inline, for the
 * person to tap Refresh when it's a good time — and if there are photos
 * not yet saved, it asks to confirm first rather than silently losing them.
 */
export function UpdateNotice({ hasUnsavedPhotos }: UpdateNoticeProps) {
  const { needRefresh, refresh } = usePwaUpdate();
  const { t } = useI18n();
  const [confirming, setConfirming] = useState(false);

  if (!needRefresh) return null;

  function handleRefreshTap() {
    if (hasUnsavedPhotos) {
      setConfirming(true);
    } else {
      refresh();
    }
  }

  return (
    <div role="status" className="mx-auto w-full max-w-[480px] px-4">
      <div className="mt-3 rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-center text-sm text-text">
        {confirming ? (
          <div className="flex flex-col gap-2">
            <p>{t.common.refreshConfirm}</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={refresh}
                className="text-rose underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                {t.common.refreshAnyway}
              </button>
            </div>
          </div>
        ) : (
          <p>
            {t.common.newVersionAvailable}
            <span className="mx-2 text-text-secondary">·</span>
            <button
              type="button"
              onClick={handleRefreshTap}
              className="underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              {t.common.refresh}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
