import { describe, expect, it } from 'vitest';
import { coverFit } from '../lib/coverFit';

describe('coverFit', () => {
  it('returns the full source when ratios already match', () => {
    const rect = coverFit(528, 396, 528, 396);
    expect(rect).toEqual({ x: 0, y: 0, width: 528, height: 396 });
  });

  it('crops the sides when the source is wider than the destination', () => {
    // 16:9 source into a 4:3 destination box — source is relatively wider.
    const rect = coverFit(1600, 900, 400, 300);
    expect(rect.y).toBe(0);
    expect(rect.height).toBe(900);
    expect(rect.width).toBeCloseTo(1200); // 900 * (400/300)
    expect(rect.x).toBeCloseTo((1600 - 1200) / 2);
  });

  it('crops the top/bottom when the source is taller than the destination', () => {
    // A tall portrait source into a 4:3 landscape destination.
    const rect = coverFit(1080, 1920, 400, 300);
    expect(rect.x).toBe(0);
    expect(rect.width).toBe(1080);
    expect(rect.height).toBeCloseTo(810); // 1080 / (400/300)
    expect(rect.y).toBeCloseTo((1920 - 810) / 2);
  });

  it('keeps the crop centered', () => {
    const rect = coverFit(2000, 1000, 100, 100);
    // dest is square, source is 2:1 -> crop width down to match height
    expect(rect.width).toBeCloseTo(1000);
    expect(rect.x).toBeCloseTo(500);
  });

  it('handles a square source into a non-square destination', () => {
    const rect = coverFit(500, 500, 528, 396); // 4:3 dest
    expect(rect.x).toBe(0);
    expect(rect.height).toBeCloseTo(375); // 500 / (528/396)
    expect(rect.y).toBeCloseTo((500 - 375) / 2);
  });

  it('throws on non-positive dimensions', () => {
    expect(() => coverFit(0, 100, 100, 100)).toThrow();
    expect(() => coverFit(100, 100, 100, 0)).toThrow();
  });
});
