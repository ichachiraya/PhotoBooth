import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';

const { slots, caption } = defaultSlotLayout();

/** A warm sepia wash with a soft vignette, for an aged-photograph feel. */
export const vintageSepia: Template = {
  id: 'vintage-sepia',
  name: { en: 'Vintage Sepia', th: 'วินเทจเซเปีย' },
  description: {
    en: 'A warm sepia wash with a soft vignette.',
    th: 'สีเซปียอบอุ่นพร้อมเงาขอบแบบภาพเก่า',
  },
  background: {
    kind: 'pattern',
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#E9D8B8');
      grad.addColorStop(1, '#D6BD93');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.62);
      vignette.addColorStop(0, 'rgba(60, 40, 10, 0)');
      vignette.addColorStop(1, 'rgba(60, 40, 10, 0.22)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    },
  },
  slots,
  overlayDraw: (ctx, _w, _h) => {
    ctx.save();
    ctx.strokeStyle = '#5B4A33';
    ctx.lineWidth = 2;
    for (const rect of slots) {
      ctx.strokeRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 30, color: '#4A3A24' },
};
