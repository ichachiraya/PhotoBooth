/**
 * Static, decorative line-art botanicals placed loosely in the corners,
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

      {/* top-left sprig */}
      <svg
        className="absolute -left-6 -top-6 h-40 w-40 text-sage opacity-[0.14]"
        viewBox="0 0 160 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M20 140 C 40 110, 35 70, 60 30" strokeLinecap="round" />
        <path d="M30 110 C 45 108, 52 98, 55 85" strokeLinecap="round" />
        <path d="M42 80 C 55 78, 62 68, 64 56" strokeLinecap="round" />
        <circle cx="60" cy="28" r="5" />
        <circle cx="68" cy="22" r="3.5" />
        <circle cx="52" cy="24" r="3.5" />
      </svg>

      {/* top-right sprig */}
      <svg
        className="absolute -right-8 top-4 h-48 w-48 text-rose opacity-[0.12]"
        viewBox="0 0 180 180"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M160 10 C 130 30, 120 60, 95 75" strokeLinecap="round" />
        <path d="M135 35 C 125 45, 112 48, 100 52" strokeLinecap="round" />
        <path d="M110 55 C 100 62, 90 64, 80 66" strokeLinecap="round" />
        <circle cx="95" cy="76" r="6" />
        <circle cx="86" cy="84" r="4" />
        <circle cx="104" cy="83" r="4" />
      </svg>

      {/* bottom-left sprig */}
      <svg
        className="absolute -bottom-10 left-2 h-52 w-52 text-rose opacity-[0.12]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M10 190 C 40 170, 55 140, 60 105" strokeLinecap="round" />
        <path d="M22 160 C 38 155, 48 142, 50 128" strokeLinecap="round" />
        <path d="M38 125 C 52 120, 60 108, 62 96" strokeLinecap="round" />
        <circle cx="60" cy="100" r="6" />
        <circle cx="50" cy="92" r="4" />
        <circle cx="70" cy="90" r="4" />
      </svg>

      {/* bottom-right sprig */}
      <svg
        className="absolute -bottom-8 -right-6 h-44 w-44 text-sage opacity-[0.14]"
        viewBox="0 0 170 170"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M160 160 C 130 145, 118 118, 118 90" strokeLinecap="round" />
        <path d="M140 130 C 128 128, 118 120, 112 110" strokeLinecap="round" />
        <circle cx="117" cy="88" r="5.5" />
        <circle cx="108" cy="80" r="3.5" />
        <circle cx="124" cy="78" r="3.5" />
      </svg>
    </div>
  );
}
