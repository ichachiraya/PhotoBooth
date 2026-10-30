import { describe, expect, it } from 'vitest';
import { templates } from '../templates';
import { buildCustomTemplate } from '../lib/customTemplateFactory';
import { BASE_HEIGHT, BASE_WIDTH } from '../lib/layout';
import type { Template } from '../types';

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

/** The same shape checks apply to a built-in template or one built from a user upload. */
function expectValidTemplate(template: Template) {
  expect(template.slots).toHaveLength(3);
  for (const slot of template.slots) {
    expect(withinBounds(slot)).toBe(true);
  }
  expect(withinBounds(template.caption)).toBe(true);
  expect(template.name.en.trim().length).toBeGreaterThan(0);
  expect(template.name.th.trim().length).toBeGreaterThan(0);
  expect(template.font.size).toBeGreaterThan(0);
  expect(template.font.family.length).toBeGreaterThan(0);
  expect(template.font.color.length).toBeGreaterThan(0);
  expect(['solid', 'gradient', 'pattern']).toContain(template.background.kind);
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
      it('is a valid template', () => expectValidTemplate(template));

      it('has a background matching its declared kind', () => {
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

  describe('a template built from a user-imported custom template', () => {
    it('is just as valid as a built-in one', async () => {
      const template = await buildCustomTemplate({
        id: 'test-id',
        name: 'My Custom Template',
        createdAt: Date.now(),
        imageBlob: new Blob(['fake-png-bytes'], { type: 'image/png' }),
      });

      expect(template.id).toBe('custom-test-id');
      // The uploaded image is the background (photos always draw on top of
      // it in their slots), not an overlay — see customTemplateFactory.ts.
      expect(template.background.kind).toBe('pattern');
      expect(template.background.draw).toBeTypeOf('function');
      expectValidTemplate(template);
    });
  });
});
