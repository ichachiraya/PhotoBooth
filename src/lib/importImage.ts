import { applyExifOrientation, getExifOrientation } from './exif';
import { downscaleCanvasIfNeeded } from './downscale';

export interface DecodedImport {
  canvas: HTMLCanvasElement;
  objectUrl: string;
}

/**
 * Full pipeline for a freshly-picked <input type="file"> image: reads its
 * EXIF orientation, decodes it with the browser's own orientation handling
 * disabled (so we apply it ourselves exactly once, consistently across
 * browsers), downscales if it's very large, and produces an object URL
 * for react-easy-crop to display. Caller is responsible for revoking the
 * object URL (via `URL.revokeObjectURL`) once the crop dialog closes.
 */
export async function decodeImportedFile(file: File): Promise<DecodedImport> {
  const orientation = await getExifOrientation(file);
  const rawBitmap = await createImageBitmap(file, { imageOrientation: 'none' });

  const oriented = applyExifOrientation(rawBitmap, rawBitmap.width, rawBitmap.height, orientation);
  rawBitmap.close();

  const canvas = downscaleCanvasIfNeeded(oriented);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.95),
  );
  if (!blob) throw new Error('Failed to encode imported image');
  const objectUrl = URL.createObjectURL(blob);

  return { canvas, objectUrl };
}

export interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Crops the decoded (already oriented + downscaled) canvas to the chosen pixel area. */
export async function cropCanvasToBitmap(
  canvas: HTMLCanvasElement,
  area: PixelArea,
): Promise<ImageBitmap> {
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(area.width));
  out.height = Math.max(1, Math.round(area.height));
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(
    canvas,
    Math.round(area.x),
    Math.round(area.y),
    out.width,
    out.height,
    0,
    0,
    out.width,
    out.height,
  );
  return createImageBitmap(out);
}
