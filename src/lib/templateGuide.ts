import type { Lang } from '../i18n/useI18n';
import { downloadBlob } from './download';
import { defaultSlotLayout, BASE_HEIGHT, BASE_WIDTH } from './layout';

const { slots } = defaultSlotLayout();

const LABELS = {
  photo: {
    en: (n: number) => `Photo ${n} — will be covered`,
    th: (n: number) => `รูปที่ ${n} — จะถูกบังด้วยรูป`,
  },
};

/**
 * Draws the 600x1800 guide: just the 3 photo windows, outlined and
 * labeled — no caption area marked. The Edit step's optional caption
 * text/date stamp still works normally on a custom template (same as
 * any built-in one); it just isn't part of what someone designs around
 * here, to keep the guide simple.
 */
export function renderTemplateGuide(lang: Lang): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  ctx.strokeStyle = '#3B3631';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '18px sans-serif';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  slots.forEach((rect, i) => {
    // Light fill so it's visually obvious this area doesn't matter — it'll
    // be fully covered by the photo regardless of what's drawn here.
    ctx.fillStyle = '#EFEFEF';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    ctx.fillStyle = '#3B3631';
    const label = LABELS.photo[lang](i + 1);
    const lines = label.split(' — ');
    ctx.fillText(lines[0] ?? label, rect.x + rect.width / 2, rect.y + rect.height / 2 - 12);
    if (lines[1]) ctx.fillText(lines[1], rect.x + rect.width / 2, rect.y + rect.height / 2 + 12);
  });

  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, BASE_WIDTH - 1, BASE_HEIGHT - 1);

  return canvas;
}

/** Renders the guide and triggers a download of it as a PNG. */
export async function downloadTemplateGuide(lang: Lang): Promise<void> {
  const canvas = renderTemplateGuide(lang);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to render the template guide');
  downloadBlob(blob, 'photobooth-template-guide.png');
}
