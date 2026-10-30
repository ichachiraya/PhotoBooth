import { describe, expect, it } from 'vitest';
import { BASE_HEIGHT, BASE_WIDTH, defaultSlotLayout } from '../lib/layout';

describe('defaultSlotLayout', () => {
  const { slots, caption } = defaultSlotLayout();

  it('produces exactly 3 non-overlapping 4:3 slots', () => {
    expect(slots).toHaveLength(3);
    for (const slot of slots) {
      expect(slot.width / slot.height).toBeCloseTo(4 / 3, 2);
    }
    // stacked vertically, each strictly below the previous one
    expect(slots[1]!.y).toBeGreaterThan(slots[0]!.y + slots[0]!.height);
    expect(slots[2]!.y).toBeGreaterThan(slots[1]!.y + slots[1]!.height);
  });

  it('keeps every slot and the caption area within the base canvas', () => {
    for (const rect of [...slots, caption]) {
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(BASE_WIDTH);
      expect(rect.y + rect.height).toBeLessThanOrEqual(BASE_HEIGHT);
    }
  });

  it('places the caption area below the last slot', () => {
    const lastSlot = slots[2]!;
    expect(caption.y).toBeGreaterThanOrEqual(lastSlot.y + lastSlot.height);
  });
});
