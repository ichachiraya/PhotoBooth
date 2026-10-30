import type { FilterId, SlotPhoto, SlotPhotos, Template } from '../types';
import { coverFit } from './coverFit';
import { applyFilterToImageData } from './filters';
import { BASE_HEIGHT, BASE_WIDTH, HQ_SCALE } from './layout';

export interface CompositeOptions {
  highQuality?: boolean;
  /** Explicit render scale (e.g. for small thumbnails). Overrides `highQuality` when set. */
  scale?: number;
  /** Mirror camera-sourced photos horizontally to match the (default-mirrored) live preview. */
  mirrorExport?: boolean;
  /** Applied uniformly to all 3 photos (never to the template's own chrome). */
  filter?: FilterId;
  caption?: string;
  showDateStamp?: boolean;
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  background: Template['background'],
  w: number,
  h: number,
) {
  if (background.kind === 'solid') {
    ctx.fillStyle = background.color ?? '#FAF6EF';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (background.kind === 'gradient' && background.gradient) {
    const { from, to, direction } = background.gradient;
    const grad =
      direction === 'vertical'
        ? ctx.createLinearGradient(0, 0, 0, h)
        : ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, from);
    grad.addColorStop(1, to);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (background.kind === 'pattern' && background.draw) {
    background.draw(ctx, w, h);
  }
}

/**
 * Pre-filters the cropped source region into a small offscreen canvas via
 * direct pixel manipulation, rather than relying on the native canvas
 * `ctx.filter` property. Filters are always applied this way: it's
 * guaranteed to look identical across every browser (no dependency on a
 * native implementation that can be buggy, slow, or silently a no-op on
 * some engines), and filtering the *source* like this — rather than
 * post-processing the destination with getImageData/putImageData — keeps
 * the result correct regardless of the destination's current transform
 * (mirroring, the outer base->output scale, etc.), since the filtered
 * result is then just drawn like any other image source.
 */
function filterCroppedSource(
  bitmap: ImageBitmap,
  crop: { x: number; y: number; width: number; height: number },
  filter: FilterId,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(crop.width));
  canvas.height = Math.max(1, Math.round(crop.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  applyFilterToImageData(imageData, filter);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function drawPhotoInSlot(
  ctx: CanvasRenderingContext2D,
  photo: SlotPhoto,
  rect: { x: number; y: number; width: number; height: number },
  mirrorExport: boolean,
  filter: FilterId,
) {
  const { bitmap, source } = photo;
  const crop = coverFit(bitmap.width, bitmap.height, rect.width, rect.height);
  const shouldMirror = mirrorExport && source === 'camera';

  let drawSource: CanvasImageSource = bitmap;
  let sx = crop.x;
  let sy = crop.y;
  let sw = crop.width;
  let sh = crop.height;
  if (filter !== 'none') {
    const filtered = filterCroppedSource(bitmap, crop, filter);
    drawSource = filtered;
    sx = 0;
    sy = 0;
    sw = filtered.width;
    sh = filtered.height;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.clip();

  if (shouldMirror) {
    ctx.translate(rect.x + rect.width, rect.y);
    ctx.scale(-1, 1);
    ctx.drawImage(drawSource, sx, sy, sw, sh, 0, 0, rect.width, rect.height);
  } else {
    ctx.drawImage(drawSource, sx, sy, sw, sh, rect.x, rect.y, rect.width, rect.height);
  }
  ctx.restore();
}

function formatDateStamp(): string {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function drawCaption(ctx: CanvasRenderingContext2D, template: Template, options: CompositeOptions) {
  const lines: string[] = [];
  if (options.caption?.trim()) lines.push(options.caption.trim());
  if (options.showDateStamp) lines.push(formatDateStamp());
  if (lines.length === 0) return;

  const { caption, font } = template;
  ctx.save();
  ctx.fillStyle = font.color;
  ctx.font = `${font.size}px ${font.family}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = caption.align;

  const textX =
    caption.align === 'center'
      ? caption.x + caption.width / 2
      : caption.align === 'right'
        ? caption.x + caption.width
        : caption.x;

  const lineHeight = font.size * 1.3;
  const totalHeight = lines.length * lineHeight;
  let y = caption.y + caption.height / 2 - totalHeight / 2 + lineHeight / 2;
  for (const line of lines) {
    ctx.fillText(line, textX, y);
    y += lineHeight;
  }
  ctx.restore();
}

/**
 * Renders the full strip (background -> photos -> template overlay -> caption)
 * to a new canvas at either the default (600x1800) or high-quality (1200x3600)
 * output resolution. Templates always author coordinates at the base size;
 * this scales the whole drawing context so they never need to know about
 * output resolution.
 */
export function renderStrip(
  template: Template,
  photos: SlotPhotos,
  options: CompositeOptions = {},
): HTMLCanvasElement {
  const scale = options.scale ?? (options.highQuality ? HQ_SCALE : 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(BASE_WIDTH * scale);
  canvas.height = Math.round(BASE_HEIGHT * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.save();
  ctx.scale(scale, scale);

  drawBackground(ctx, template.background, BASE_WIDTH, BASE_HEIGHT);

  const filter = options.filter ?? 'none';

  template.slots.forEach((rect, i) => {
    const photo = photos[i];
    if (!photo) return;
    drawPhotoInSlot(ctx, photo, rect, options.mirrorExport ?? false, filter);
  });

  template.overlayDraw?.(ctx, BASE_WIDTH, BASE_HEIGHT);
  drawCaption(ctx, template, options);

  ctx.restore();
  return canvas;
}
