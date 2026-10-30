import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';
import { drawFloralBorder } from '../lib/floralMotifs';

const { slots, caption } = defaultSlotLayout();

/** Cream paper with sage line-art botanicals loosely scattered along the margins. */
export const floralSage: Template = {
  id: 'floral-sage',
  name: { en: 'Pressed Sage', th: 'ใบเสจอัดแห้ง' },
  description: {
    en: 'Cream paper with delicate sage line-art sprigs in the margins.',
    th: 'กระดาษสีครีมพร้อมลายเส้นใบเสจบางๆ ที่ขอบ',
  },
  background: { kind: 'solid', color: '#FAF6EF' },
  slots,
  overlayDraw: (ctx, w, h) => {
    drawFloralBorder(ctx, w, h, '#9AA58E', 0.55);
    ctx.save();
    ctx.strokeStyle = '#9AA58E';
    ctx.lineWidth = 1;
    for (const rect of slots) {
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
};
