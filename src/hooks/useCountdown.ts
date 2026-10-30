import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownResult {
  /** Current number shown, or null when not counting down. */
  count: number | null;
  isRunning: boolean;
  start: () => void;
  cancel: () => void;
}

/**
 * A simple 1-second-tick countdown. `seconds` is the starting number
 * (3 / 5 / 10 from settings); calls `onComplete` once it reaches 0.
 */
export function useCountdown(seconds: number, onComplete: () => void): UseCountdownResult {
  const [count, setCount] = useState<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback(() => {
    setCount(seconds);
  }, [seconds]);

  const cancel = useCallback(() => {
    setCount(null);
  }, []);

  useEffect(() => {
    if (count === null) return;
    const id = window.setTimeout(() => {
      // Reaching zero is handled inside this async callback (not synchronously
      // in the effect body) so onComplete fires exactly once per countdown.
      if (count <= 1) {
        onCompleteRef.current();
        setCount(null);
      } else {
        setCount(count - 1);
      }
    }, 1000);
    return () => window.clearTimeout(id);
  }, [count]);

  return { count, isRunning: count !== null, start, cancel };
}
