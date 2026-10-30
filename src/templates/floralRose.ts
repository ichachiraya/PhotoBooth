import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';
import { drawFloralBorder } from '../lib/floralMotifs';

const { slots, caption } = defaultSlotLayout();

/** Cream paper with dusty-rose line-art botanicals and a double thin frame. */
export const floralRose: Template = {
  id: 'floral-rose',
  name: { en: 'Dusty Rose Sprig', th: 'กิ่งดอกชมพูฝุ่น' },
  description: {
    en: 'Cream paper with dusty-rose line-art sprigs and a double thin frame.',
    th: 'กระดาษสีครีมพร้อมลายเส้นดอกชมพูฝุ่นและกรอบเส้นคู่บาง',
  },
  background: { kind: 'solid', color: '#FAF6EF' },
  slots,
  overlayDraw: (ctx, w, h) => {
    drawFloralBorder(ctx, w, h, '#D4A5A0', 0.55);
    ctx.save();
    ctx.strokeStyle = '#9AA58E';
    ctx.lineWidth = 1;
    ctx.strokeRect(20.5, 20.5, w - 41, h - 41);
    ctx.strokeStyle = '#D4A5A0';
    for (const rect of slots) {
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
};
