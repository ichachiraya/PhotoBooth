import { BASE_HEIGHT, BASE_WIDTH } from './layout';

/** Reject absurdly large uploads before even attempting to decode them. */
export const MAX_TEMPLATE_FILE_BYTES = 20 * 1024 * 1024; // 20MB

/**
 * Normalizes an uploaded template image to a fixed 600x1800 canvas,
 * preserving transparency. Whatever size/aspect the person uploaded
 * (ideally matching the downloadable guide exactly) gets stretched to fit
 * the canonical canvas — matching the guide avoids any distortion, but a
 * mismatched size still works rather than being rejected. Returns the
 * canvas itself (not yet encoded) so the caller can run transparency
 * detection and/or build a live preview before committing to a Blob.
 */
export async function normalizeCustomTemplateImage(file: File): Promise<HTMLCanvasElement> {
  if (file.size > MAX_TEMPLATE_FILE_BYTES) {
    throw new Error('File is too large');
  }

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT); // keep transparency, not a solid fill
    ctx.drawImage(bitmap, 0, 0, BASE_WIDTH, BASE_HEIGHT);
    return canvas;
  } finally {
    bitmap.close();
  }
}

/** Encodes a (normalized) canvas as a PNG Blob, for persisting to the template store. */
export async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to encode the template image');
  return blob;
}
