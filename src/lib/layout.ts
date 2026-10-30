import type { CaptionArea, SlotRect } from '../types';

/** Default/"normal" output size: 2x6in @300dpi. */
export const BASE_WIDTH = 600;
export const BASE_HEIGHT = 1800;
/** Multiplier for the "High quality" output option (1200x3600). */
export const HQ_SCALE = 2;

/**
 * The shared 3-slot (4:3 landscape frames) layout most templates use:
 * 36px side margins, 528x396 slots, 24px gaps, and a 300px caption area
 * at the bottom. A template can still author its own `slots`/`caption`
 * (e.g. the film-strip template narrows slots to leave room for sprocket
 * holes) — this is just the common case factored out.
 */
export function defaultSlotLayout(): {
  slots: [SlotRect, SlotRect, SlotRect];
  caption: CaptionArea;
} {
  const margin = 36;
  const width = BASE_WIDTH - margin * 2;
  const height = Math.round(width * (3 / 4));
  const gap = 24;
  const topMargin = 48;

  const slots: [SlotRect, SlotRect, SlotRect] = [0, 1, 2].map((i) => ({
    x: margin,
    y: topMargin + i * (height + gap),
    width,
    height,
  })) as [SlotRect, SlotRect, SlotRect];

  const lastSlot = slots[2];
  const caption: CaptionArea = {
    x: margin,
    y: lastSlot.y + lastSlot.height + margin,
    width,
    height: 300,
    align: 'center',
  };

  return { slots, caption };
}
