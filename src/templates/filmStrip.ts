import type { CaptionArea, SlotRect, Template } from '../types';
import { BASE_WIDTH } from '../lib/layout';

const BAND_WIDTH = 40;
const SLOT_MARGIN = 16;
const SLOT_X = BAND_WIDTH + SLOT_MARGIN;
const SLOT_WIDTH = BASE_WIDTH - SLOT_X * 2;
const SLOT_HEIGHT = Math.round(SLOT_WIDTH * (3 / 4));
const GAP = 24;
const TOP_MARGIN = 48;

const slots: [SlotRect, SlotRect, SlotRect] = [0, 1, 2].map((i) => ({
  x: SLOT_X,
  y: TOP_MARGIN + i * (SLOT_HEIGHT + GAP),
  width: SLOT_WIDTH,
  height: SLOT_HEIGHT,
})) as [SlotRect, SlotRect, SlotRect];

const lastSlot = slots[2];
const caption: CaptionArea = {
  x: SLOT_X,
  y: lastSlot.y + lastSlot.height + 36,
  width: SLOT_WIDTH,
  height: 220,
  align: 'center',
};

function drawSprocketHoles(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = '#FAF6EF';
  const holeW = 18;
  const holeH = 12;
  const stepY = 64;
  for (let y = 24; y < h - 10; y += stepY) {
    const r = 3;
    for (const bandX of [BAND_WIDTH / 2 - holeW / 2, w - BAND_WIDTH / 2 - holeW / 2]) {
      ctx.beginPath();
      ctx.roundRect(bandX, y, holeW, holeH, r);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Black film-strip look with punched sprocket holes along both edges. */
export const filmStrip: Template = {
  id: 'film-strip',
  name: { en: 'Film Strip', th: 'ฟิล์มภาพยนตร์' },
  description: {
    en: 'Black strip with sprocket holes, like a classic negative.',
    th: 'แถบสีดำพร้อมรูฟิล์ม สไตล์ฟิล์มเนกาทิฟคลาสสิก',
  },
  background: { kind: 'solid', color: '#1E1B18' },
  slots,
  overlayDraw: (ctx, w, h) => {
    drawSprocketHoles(ctx, w, h);
    ctx.save();
    ctx.strokeStyle = '#FAF6EF';
    ctx.lineWidth = 1;
    for (const rect of slots) {
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);
    }
    ctx.restore();
  },
  caption,
  font: { family: "'IBM Plex Sans Thai', sans-serif", size: 24, color: '#FAF6EF' },
};
