import { BASE_HEIGHT, BASE_WIDTH, defaultSlotLayout } from './layout';

export type TemplateOverlayMode = 'overlay' | 'background';

/**
 * Average alpha (0-255) across the sampled photo-window pixels below
 * this counts as "mostly transparent" and is classified as an overlay.
 * At or above it counts as "mostly opaque" and is classified as a
 * background. 128 (50%) sits exactly between the two, so a design that's
 * uniformly half-transparent in the windows lands on the safer side
 * (background — the photo still covers it either way).
 */
export const OVERLAY_ALPHA_THRESHOLD = 128;

/**
 * Pure classification over a flat list of alpha samples (0-255 each) —
 * no canvas involved, so this is directly unit-testable. A handful of
 * small opaque pixels (e.g. a little corner sticker) inside an otherwise
 * transparent window barely moves the average, so it still reads as
 * "overlay" — exactly the shape a real decorative design takes.
 */
export function classifyOverlayMode(alphaSamples: Iterable<number>): TemplateOverlayMode {
  let sum = 0;
  let count = 0;
  for (const alpha of alphaSamples) {
    sum += alpha;
    count++;
  }
  if (count === 0) return 'background';
  const average = sum / count;
  return average < OVERLAY_ALPHA_THRESHOLD ? 'overlay' : 'background';
}

function* alphaChannel(imageData: ImageData): Generator<number> {
  const { data } = imageData;
  for (let i = 3; i < data.length; i += 4) {
    yield data[i]!;
  }
}

// Sampling at a quarter of the base resolution keeps this cheap (a few
// tens of thousands of pixels instead of ~600k) without meaningfully
// changing the average-alpha result.
const ANALYSIS_SCALE = 0.25;
const ANALYSIS_WIDTH = Math.round(BASE_WIDTH * ANALYSIS_SCALE);
const ANALYSIS_HEIGHT = Math.round(BASE_HEIGHT * ANALYSIS_SCALE);
const { slots } = defaultSlotLayout();

/**
 * Samples the alpha channel inside the 3 photo windows of a normalized
 * (600x1800) template canvas and classifies it — see `classifyOverlayMode`.
 */
export function detectTemplateOverlayMode(sourceCanvas: HTMLCanvasElement): TemplateOverlayMode {
  const analysisCanvas = document.createElement('canvas');
  analysisCanvas.width = ANALYSIS_WIDTH;
  analysisCanvas.height = ANALYSIS_HEIGHT;
  const ctx = analysisCanvas.getContext('2d');
  if (!ctx) return 'background';
  ctx.drawImage(sourceCanvas, 0, 0, ANALYSIS_WIDTH, ANALYSIS_HEIGHT);

  const samples: number[] = [];
  for (const rect of slots) {
    const x = Math.round(rect.x * ANALYSIS_SCALE);
    const y = Math.round(rect.y * ANALYSIS_SCALE);
    const w = Math.max(1, Math.round(rect.width * ANALYSIS_SCALE));
    const h = Math.max(1, Math.round(rect.height * ANALYSIS_SCALE));
    const imageData = ctx.getImageData(x, y, w, h);
    samples.push(...alphaChannel(imageData));
  }

  return classifyOverlayMode(samples);
}
