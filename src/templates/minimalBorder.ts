import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';

const { slots, caption } = defaultSlotLayout();

/** Cream background, a single thin border — the quietest preset. */
export const minimalBorder: Template = {
  id: 'minimal-border',
  name: { en: 'Minimal', th: 'มินิมัล' },
  description: {
    en: 'Cream background with just a single thin border.',
    th: 'พื้นหลังสีครีมพร้อมกรอบเส้นบางเพียงเส้นเดียว',
  },
  background: { kind: 'solid', color: '#FAF6EF' },
  slots,
  overlayDraw: (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = '#E4DBCD';
    ctx.lineWidth = 1;
    ctx.strokeRect(24.5, 24.5, w - 49, h - 49);
    for (const rect of slots) {
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 28, color: '#3B3631' },
};
