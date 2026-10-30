interface SprigPlacement {
  /** Tailwind position + size classes. */
  className: string;
  color: 'sage' | 'rose';
  opacity: number;
  rotate?: number;
  flip?: boolean;
}

/** One reusable botanical line-art shape — a stem with a few leaves and a small flower head. */
function Sprig({ className, color, opacity, rotate = 0, flip = false }: SprigPlacement) {
  return (
    <svg
      className={`absolute ${color === 'sage' ? 'text-sage' : 'text-rose'} ${className}`}
      style={{ opacity, transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1})` }}
      viewBox="0 0 120 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path d="M20 150 C 45 115, 38 75, 62 35" strokeLinecap="round" />
      <path d="M30 118 C 48 114, 56 102, 58 88" strokeLinecap="round" />
      <path d="M44 84 C 58 80, 66 68, 68 54" strokeLinecap="round" />
      <path d="M26 95 C 14 92, 6 82, 4 70" strokeLinecap="round" />
      <circle cx="62" cy="32" r="5.5" />
      <circle cx="71" cy="25" r="3.8" />
      <circle cx="53" cy="27" r="3.8" />
      <circle cx="63" cy="22" r="2.6" />
    </svg>
  );
}

// Loosely scattered along every edge (not just corners) so wider/taller
// screens read as framed rather than leaving long bare margins. Still
// kept out of the centered content column, low-opacity, and static.
const SPRIGS: SprigPlacement[] = [
  { className: 'h-40 w-40 -left-7 -top-7', color: 'sage', opacity: 0.2 },
  { className: 'h-48 w-48 -right-9 top-2', color: 'rose', opacity: 0.17, flip: true },
  {
    className: 'h-32 w-32 left-[4%] top-[32%]',
    color: 'rose',
    opacity: 0.16,
    rotate: -18,
    flip: true,
  },
  { className: 'h-32 w-32 right-[4%] top-[38%]', color: 'sage', opacity: 0.18, rotate: 16 },
  { className: 'h-32 w-32 -left-8 bottom-[26%]', color: 'sage', opacity: 0.16, rotate: 12 },
  {
    className: 'h-32 w-32 -right-7 bottom-[22%]',
    color: 'sage',
    opacity: 0.15,
    rotate: -14,
    flip: true,
  },
  { className: 'h-52 w-52 -bottom-11 left-1', color: 'rose', opacity: 0.18, rotate: 6 },
  { className: 'h-44 w-44 -bottom-9 -right-6', color: 'sage', opacity: 0.2, flip: true },
];

/**
 * Static, decorative line-art botanicals scattered along the page edges,
 * plus a very subtle paper-grain texture. Purely inline SVG — no external
 * assets, no animation, kept out of the way of controls/camera preview.
 * `aria-hidden` since it carries no content.
 */
export function FloralBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full">
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.025" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {SPRIGS.map((placement, i) => (
        <Sprig key={i} {...placement} />
      ))}
    </div>
  );
}
