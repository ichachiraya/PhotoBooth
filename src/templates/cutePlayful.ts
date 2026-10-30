import type { Template } from '../types';
import { defaultSlotLayout } from '../lib/layout';

const { slots, caption } = defaultSlotLayout();

const DOT_SPOTS: Array<{ x: number; y: number; r: number; color: string }> = [
  { x: 18, y: 30, r: 5, color: '#D4A5A0' },
  { x: 582, y: 44, r: 4, color: '#9AA58E' },
  { x: 16, y: 456, r: 4, color: '#9AA58E' },
  { x: 584, y: 480, r: 5, color: '#D4A5A0' },
  { x: 18, y: 876, r: 5, color: '#D4A5A0' },
  { x: 582, y: 900, r: 4, color: '#9AA58E' },
];

/** Cream background, rounded alternating sage/rose slot frames, a few small dots. */
export const cutePlayful: Template = {
  id: 'cute-playful',
  name: { en: 'Playful Dots', th: 'จุดแต้มสดใส' },
  description: {
    en: 'Rounded alternating sage and rose frames with a few small dots.',
    th: 'กรอบมุมโค้งสลับสีเขียวเสจและชมพูฝุ่น พร้อมจุดเล็กๆ',
  },
  background: { kind: 'solid', color: '#FAF6EF' },
  slots,
  overlayDraw: (ctx) => {
    ctx.save();
    const colors = ['#9AA58E', '#D4A5A0', '#9AA58E'] as const;
    slots.forEach((rect, i) => {
      ctx.strokeStyle = colors[i] ?? colors[0];
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 10);
      ctx.stroke();
    });
    for (const dot of DOT_SPOTS) {
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  caption,
  font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
};
