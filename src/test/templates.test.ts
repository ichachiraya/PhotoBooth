import { describe, expect, it } from 'vitest';
import { templates } from '../templates';
import { BASE_HEIGHT, BASE_WIDTH } from '../lib/layout';

function withinBounds(rect: { x: number; y: number; width: number; height: number }) {
  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.width > 0 &&
    rect.height > 0 &&
    rect.x + rect.width <= BASE_WIDTH &&
    rect.y + rect.height <= BASE_HEIGHT
  );
}

describe('template config validation', () => {
  it('ships at least 6 templates', () => {
    expect(templates.length).toBeGreaterThanOrEqual(6);
  });

  it('has unique ids', () => {
    const ids = templates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const template of templates) {
    describe(template.id, () => {
      it('has exactly 3 slots, each within the base canvas bounds', () => {
        expect(template.slots).toHaveLength(3);
        for (const slot of template.slots) {
          expect(withinBounds(slot)).toBe(true);
        }
      });

      it('has a caption area within the base canvas bounds', () => {
        expect(withinBounds(template.caption)).toBe(true);
      });

      it('has non-empty English and Thai names', () => {
        expect(template.name.en.trim().length).toBeGreaterThan(0);
        expect(template.name.th.trim().length).toBeGreaterThan(0);
      });

      it('has a usable font config', () => {
        expect(template.font.size).toBeGreaterThan(0);
        expect(template.font.family.length).toBeGreaterThan(0);
        expect(template.font.color.length).toBeGreaterThan(0);
      });

      it('has a valid background', () => {
        expect(['solid', 'gradient', 'pattern']).toContain(template.background.kind);
        if (template.background.kind === 'solid') {
          expect(template.background.color).toBeTruthy();
        }
        if (template.background.kind === 'gradient') {
          expect(template.background.gradient).toBeTruthy();
        }
        if (template.background.kind === 'pattern') {
          expect(template.background.draw).toBeTypeOf('function');
        }
      });
    });
  }
});
