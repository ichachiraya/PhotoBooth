/**
 * Large serif numeral that fades in and out over the live preview during
 * the countdown. Purely visual — the actual timing lives in useCountdown.
 */
export function CountdownOverlay({ count }: { count: number }) {
  return (
    <div
      key={count}
      aria-live="polite"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <span
        className="animate-[countdown-fade_1s_ease-out] font-serif text-[6rem] text-bg drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]"
        style={{ animationFillMode: 'both' }}
      >
        {count}
      </span>
    </div>
  );
}
