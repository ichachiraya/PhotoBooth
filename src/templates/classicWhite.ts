import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';

const { slots, caption } = defaultSlotLayout();

/** Plain white background, a thin charcoal frame around each photo. No frills. */
export const classicWhite: Template = {
  id: 'classic-white',
  name: { en: 'Classic White', th: 'คลาสสิกสีขาว' },
  description: {
    en: 'A plain white strip with a thin frame around each photo.',
    th: 'แถบสีขาวเรียบง่าย พร้อมกรอบเส้นบางรอบแต่ละภาพ',
  },
  background: { kind: 'solid', color: '#FFFFFF' },
  slots,
  overlayDraw: (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = '#3B3631';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    for (const rect of slots) {
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
};
