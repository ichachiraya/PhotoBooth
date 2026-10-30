import { downloadBlob } from './download';
import { defaultSlotLayout, BASE_HEIGHT, BASE_WIDTH } from './layout';

const { slots } = defaultSlotLayout();

/**
 * Draws the 600x1800 guide: a white "canvas" to design on, with the 3
 * photo windows punched out as real transparent holes (not just an
 * opaque placeholder fill) and outlined with a dashed border — no label
 * text inside them. Labels used to say "Photo N — transparent", but
 * since that text is itself opaque, anyone who designed directly on top
 * of the guide and didn't erase it got the words baked right into their
 * template, showing up over the photo. The dashed outline alone is
 * enough to mark where each window is. No caption area marked either —
 * the Edit step's optional caption text/date stamp still works normally
 * on a custom template either way; it just isn't part of what someone
 * designs around here, to keep the guide simple.
 */
export function renderTemplateGuide(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  ctx.strokeStyle = '#3B3631';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  for (const rect of slots) {
    // A real transparent hole, not a solid fill — see the doc comment above.
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, BASE_WIDTH - 1, BASE_HEIGHT - 1);

  return canvas;
}

/** Renders the guide and triggers a download of it as a PNG. */
export async function downloadTemplateGuide(): Promise<void> {
  const canvas = renderTemplateGuide();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to render the template guide');
  downloadBlob(blob, 'photobooth-template-guide.png');
}
