import { describe, expect, it } from 'vitest';
import { renderStrip } from '../lib/compositor';
import { classicWhite } from '../templates/classicWhite';
import { BASE_HEIGHT, BASE_WIDTH, HQ_SCALE } from '../lib/layout';
import type { SlotPhoto, SlotPhotos } from '../types';

// The global test setup (src/test/setup.ts) installs a no-op canvas 2D
// context, since jsdom has no real renderer — see mockCanvasContext.ts.

function fakeImageBitmap(width: number, height: number): SlotPhoto {
  return { bitmap: { width, height } as unknown as ImageBitmap, source: 'camera' };
}

describe('renderStrip', () => {
  const photos: SlotPhotos = [fakeImageBitmap(1600, 1200), fakeImageBitmap(1600, 1200), null];

  it('renders at the default 600x1800 size', () => {
    const canvas = renderStrip(classicWhite, photos);
    expect(canvas.width).toBe(BASE_WIDTH);
    expect(canvas.height).toBe(BASE_HEIGHT);
  });

  it('renders at 1200x3600 when highQuality is requested', () => {
    const canvas = renderStrip(classicWhite, photos, { highQuality: true });
    expect(canvas.width).toBe(BASE_WIDTH * HQ_SCALE);
    expect(canvas.height).toBe(BASE_HEIGHT * HQ_SCALE);
  });

  it('renders at an arbitrary explicit scale (e.g. for thumbnails)', () => {
    const canvas = renderStrip(classicWhite, photos, { scale: 110 / BASE_WIDTH });
    expect(canvas.width).toBe(110);
  });

  it('does not throw when a slot has no photo yet', () => {
    expect(() => renderStrip(classicWhite, [null, null, null])).not.toThrow();
  });
});
