import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';

const { slots, caption } = defaultSlotLayout();

/** A soft sage-to-rose gradient wash behind thin white-framed photos. */
export const pastel: Template = {
  id: 'pastel',
  name: { en: 'Pastel Wash', th: 'พาสเทลอ่อน' },
  description: {
    en: 'A soft sage-to-rose gradient behind thin white frames.',
    th: 'ไล่สีเขียวเสจไปชมพูฝุ่นอ่อนๆ พร้อมกรอบขาวบาง',
  },
  background: {
    kind: 'gradient',
    gradient: { from: '#E7EBE2', to: '#F2E3DF', direction: 'vertical' },
  },
  slots,
  overlayDraw: (ctx, _w, _h) => {
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    for (const rect of slots) {
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 30, color: '#6B6259' },
};
