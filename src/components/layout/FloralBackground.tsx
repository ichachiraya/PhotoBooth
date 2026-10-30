interface SprigPlacement {
  /** Tailwind position + size classes. */
  className: string;
  /** Bloom color — leaves/stems always stay sage-green for a natural, cohesive look. */
  flowerColor: string;
  flowerType: 'cluster' | 'petals';
  opacity: number;
  rotate?: number;
  flip?: boolean;
}

/** A small 5-petal bloom with a warm gold center, radiating out from (cx, cy). */
function PetalFlower({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`} fill={color}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-8.5" rx="4" ry="7" transform={`rotate(${deg})`} />
      ))}
      <circle r="2.8" fill="var(--color-gold)" />
    </g>
  );
}

/** One reusable botanical shape — a stem with a few leaves and a colored bloom. */
function Sprig({
  className,
  flowerColor,
  flowerType,
  opacity,
  rotate = 0,
  flip = false,
}: SprigPlacement) {
  return (
    <svg
      className={`absolute ${className}`}
      style={{ opacity, transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1})` }}
      viewBox="0 0 120 160"
      fill="none"
    >
      <g stroke="var(--color-sage)" strokeWidth="1.3" strokeLinecap="round">
        <path d="M20 150 C 45 115, 38 75, 62 35" />
        <path d="M30 118 C 48 114, 56 102, 58 88" />
        <path d="M44 84 C 58 80, 66 68, 68 54" />
        <path d="M26 95 C 14 92, 6 82, 4 70" />
      </g>
      {flowerType === 'cluster' ? (
        <g fill={flowerColor}>
          <circle cx="62" cy="32" r="5.5" />
          <circle cx="71" cy="25" r="3.8" />
          <circle cx="53" cy="27" r="3.8" />
          <circle cx="63" cy="22" r="2.6" />
        </g>
      ) : (
        <PetalFlower cx={62} cy={28} color={flowerColor} />
      )}
    </svg>
  );
}

// A warm "summer meadow" palette — dusty rose, coral, golden yellow, peach,
// and sage — scattered along every edge (not just corners), with two bloom
// shapes for real variety. Still low-opacity, static, and kept clear of the
// centered content column.
const SPRIGS: SprigPlacement[] = [
  {
    className: 'h-40 w-40 -left-7 -top-7',
    flowerColor: 'var(--color-rose)',
    flowerType: 'petals',
    opacity: 0.26,
  },
  {
    className: 'h-48 w-48 -right-9 top-2',
    flowerColor: 'var(--color-gold)',
    flowerType: 'cluster',
    opacity: 0.24,
    flip: true,
  },
  {
    className: 'h-32 w-32 left-[4%] top-[32%]',
    flowerColor: 'var(--color-coral)',
    flowerType: 'petals',
    opacity: 0.22,
    rotate: -18,
    flip: true,
  },
  {
    className: 'h-32 w-32 right-[4%] top-[38%]',
    flowerColor: 'var(--color-sage)',
    flowerType: 'cluster',
    opacity: 0.24,
    rotate: 16,
  },
  {
    className: 'h-32 w-32 -left-8 bottom-[26%]',
    flowerColor: 'var(--color-peach)',
    flowerType: 'petals',
    opacity: 0.22,
    rotate: 12,
  },
  {
    className: 'h-32 w-32 -right-7 bottom-[22%]',
    flowerColor: 'var(--color-rose)',
    flowerType: 'cluster',
    opacity: 0.2,
    rotate: -14,
    flip: true,
  },
  {
    className: 'h-52 w-52 -bottom-11 left-1',
    flowerColor: 'var(--color-gold)',
    flowerType: 'petals',
    opacity: 0.24,
    rotate: 6,
  },
  {
    className: 'h-44 w-44 -bottom-9 -right-6',
    flowerColor: 'var(--color-coral)',
    flowerType: 'cluster',
    opacity: 0.26,
    flip: true,
  },
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
