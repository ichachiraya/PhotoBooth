import { useEffect } from 'react';

/** Warns the user before they navigate away while they have an unsaved strip. */
export function useBeforeUnload(shouldWarn: boolean): void {
  useEffect(() => {
    if (!shouldWarn) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldWarn]);
}
