import type { Lang } from '../i18n/useI18n';
import { downloadBlob } from './download';
import { defaultSlotLayout, BASE_HEIGHT, BASE_WIDTH } from './layout';

const { slots, caption } = defaultSlotLayout();

const LABELS = {
  photo: {
    en: (n: number) => `Photo ${n} — keep transparent`,
    th: (n: number) => `รูปที่ ${n} — เว้นโปร่งใส`,
  },
  caption: { en: 'Caption area (optional)', th: 'พื้นที่คำบรรยาย (ไม่บังคับ)' },
};

/** Draws the 600x1800 guide: the 3 slot windows + caption area, outlined and labeled. */
export function renderTemplateGuide(lang: Lang): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  ctx.strokeStyle = '#3B3631';
  ctx.fillStyle = '#3B3631';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '18px sans-serif';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  slots.forEach((rect, i) => {
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    const label = LABELS.photo[lang](i + 1);
    const lines = label.split(' — ');
    ctx.fillText(lines[0] ?? label, rect.x + rect.width / 2, rect.y + rect.height / 2 - 12);
    if (lines[1]) ctx.fillText(lines[1], rect.x + rect.width / 2, rect.y + rect.height / 2 + 12);
  });

  ctx.strokeRect(caption.x, caption.y, caption.width, caption.height);
  ctx.fillText(LABELS.caption[lang], caption.x + caption.width / 2, caption.y + caption.height / 2);

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
