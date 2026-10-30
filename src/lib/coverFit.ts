export interface CoverRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Pure object-fit:cover math. Given a source image size and a destination
 * box size, returns the centered crop rect (in source pixel coordinates)
 * that should be drawn to fill the destination box with no letterboxing —
 * the same behavior as CSS `object-fit: cover; object-position: center`.
 */
export function coverFit(
  srcWidth: number,
  srcHeight: number,
  destWidth: number,
  destHeight: number,
): CoverRect {
  if (srcWidth <= 0 || srcHeight <= 0 || destWidth <= 0 || destHeight <= 0) {
    throw new Error('coverFit: all dimensions must be positive');
  }

  const srcRatio = srcWidth / srcHeight;
  const destRatio = destWidth / destHeight;

  if (srcRatio > destRatio) {
    // Source is relatively wider than the destination — crop its sides.
    const width = srcHeight * destRatio;
    return { x: (srcWidth - width) / 2, y: 0, width, height: srcHeight };
  }

  // Source is relatively taller (or equal ratio) — crop its top/bottom.
  const height = srcWidth / destRatio;
  return { x: 0, y: (srcHeight - height) / 2, width: srcWidth, height };
}
