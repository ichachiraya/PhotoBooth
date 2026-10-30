/** Imported images larger than this (on their longest side) are downscaled before processing. */
export const MAX_IMPORT_DIMENSION = 2000;

/**
 * Caps very large imported images to MAX_IMPORT_DIMENSION on their longest
 * side, to avoid memory pressure on mobile when cropping/compositing.
 * Returns the same canvas untouched if it's already small enough.
 */
export function downscaleCanvasIfNeeded(
  canvas: HTMLCanvasElement,
  maxDimension = MAX_IMPORT_DIMENSION,
): HTMLCanvasElement {
  const longSide = Math.max(canvas.width, canvas.height);
  if (longSide <= maxDimension) return canvas;

  const scale = maxDimension / longSide;
  const out = document.createElement('canvas');
  out.width = Math.round(canvas.width * scale);
  out.height = Math.round(canvas.height * scale);

  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out;
}
