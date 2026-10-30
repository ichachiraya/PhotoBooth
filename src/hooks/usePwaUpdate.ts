import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Browsers only re-check a registered service worker's script for changes
 * on navigation, plus an internal check at most once per ~24h for
 * long-lived tabs — not reliably often enough for an installed PWA that
 * can stay open for days. This polls explicitly, and also re-checks
 * whenever the tab regains focus (the moment an update matters most).
 */
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly

export interface PwaUpdateState {
  /** True once a new version has installed and is ready to take over. */
  needRefresh: boolean;
  /** Activates the new service worker and reloads to pick it up. */
  refresh: () => void;
}

export function usePwaUpdate(): PwaUpdateState {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      const checkForUpdate = () => {
        registration.update().catch(() => {
          // Offline or a transient network error — just retry next time.
        });
      };

      checkForUpdate(); // also check right away, not just after the first interval
      const intervalId = window.setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      // The registration (and this callback) only ever fires once for the
      // tab's lifetime, so there's nothing to tear this down for early —
      // just stop polling once the tab itself is going away.
      window.addEventListener('beforeunload', () => {
        window.clearInterval(intervalId);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      });
    },
    onRegisterError(error) {
      console.error('Service worker registration failed', error);
    },
  });

  return {
    needRefresh,
    refresh: () => {
      void updateServiceWorker(true);
    },
  };
}
