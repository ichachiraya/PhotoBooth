import { orientation as readOrientation } from 'exifr';

export type ExifOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Reads the EXIF orientation tag from an image file. Defaults to 1 (upright) if absent/unreadable. */
export async function getExifOrientation(file: File): Promise<ExifOrientation> {
  try {
    const value = await readOrientation(file);
    if (typeof value === 'number' && value >= 1 && value <= 8) {
      return value as ExifOrientation;
    }
  } catch {
    // No EXIF data, or an unsupported format — treat as already upright.
  }
  return 1;
}

/**
 * Draws `source` onto a new canvas, corrected for the given EXIF
 * orientation (handles all 8 cases: flips, 90/270 rotations, transpose).
 * `width`/`height` are the source's own (unrotated) pixel dimensions.
 */
export function applyExifOrientation(
  source: CanvasImageSource,
  width: number,
  height: number,
  orientation: ExifOrientation,
): HTMLCanvasElement {
  const swapped = orientation >= 5;
  const canvas = document.createElement('canvas');
  canvas.width = swapped ? height : width;
  canvas.height = swapped ? width : height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break; // 1: already upright, no transform needed.
  }

  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}
