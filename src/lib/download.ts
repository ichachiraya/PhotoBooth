import type { OutputFormat, SlotPhotos, Template } from '../types';
import { renderStrip, type CompositeOptions } from './compositor';

export interface ExportResult {
  blob: Blob;
  filename: string;
}

function mimeFor(format: OutputFormat): string {
  return format === 'jpg' ? 'image/jpeg' : 'image/png';
}

/** Renders the strip and encodes it as a downloadable/shareable Blob. JPG uses quality 0.92. */
export async function exportStrip(
  template: Template,
  photos: SlotPhotos,
  options: CompositeOptions,
  format: OutputFormat,
): Promise<ExportResult> {
  const canvas = renderStrip(template, photos, options);
  const quality = format === 'jpg' ? 0.92 : undefined;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeFor(format), quality),
  );
  if (!blob) throw new Error('Failed to encode the photo strip');

  const stamp = new Date().toISOString().slice(0, 10);
  const ext = format === 'jpg' ? 'jpg' : 'png';
  return { blob, filename: `photo-booth-${stamp}.${ext}` };
}

/** Triggers a browser download of the given blob via a throwaway anchor element. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke slightly later so Safari/Firefox have time to actually start the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Whether navigator.share can be used with image files on this browser. */
export function canShareFiles(): boolean {
  if (!navigator.share || !navigator.canShare) return false;
  try {
    const probe = new File([new Uint8Array([1])], 'probe.png', { type: 'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * Opens the native share sheet with the strip as a file. Returns true if
 * the share sheet was shown (including if the person then cancelled it —
 * that's a user choice, not a failure), false if sharing isn't usable
 * here at all, so the caller can fall back to a direct download.
 */
export async function shareBlob(blob: Blob, filename: string, title: string): Promise<boolean> {
  if (!navigator.share) return false;
  const file = new File([blob], filename, { type: blob.type });
  if (navigator.canShare && !navigator.canShare({ files: [file] })) return false;

  try {
    await navigator.share({ files: [file], title });
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return true;
    return false;
  }
}
