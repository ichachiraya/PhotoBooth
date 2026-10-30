import { describe, expect, it, vi } from 'vitest';
import { templates } from '../templates';
import { buildCustomTemplate } from '../lib/customTemplateFactory';
import * as customTemplateStore from '../lib/customTemplateStore';
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
    it('in "background" mode, is a pattern background and just as valid as a built-in one', async () => {
      const template = await buildCustomTemplate({
        id: 'test-id',
        name: 'My Custom Template',
        mode: 'background',
        createdAt: Date.now(),
        imageBlob: new Blob(['fake-png-bytes'], { type: 'image/png' }),
      });

      expect(template.id).toBe('custom-test-id');
      // Photos always draw on top of the uploaded image in their slots.
      expect(template.background.kind).toBe('pattern');
      expect(template.background.draw).toBeTypeOf('function');
      expect(template.overlayDraw).toBeUndefined();
      expectValidTemplate(template);
    });

    it('in "overlay" mode, draws on top of the photos and is still valid', async () => {
      const template = await buildCustomTemplate({
        id: 'test-id-2',
        name: 'My Overlay Template',
        mode: 'overlay',
        createdAt: Date.now(),
        imageBlob: new Blob(['fake-png-bytes'], { type: 'image/png' }),
      });

      expect(template.id).toBe('custom-test-id-2');
      expect(template.background.kind).toBe('solid'); // plain cream behind the photo
      expect(template.overlayDraw).toBeTypeOf('function');
      expectValidTemplate(template);
    });

    it('re-detects the mode for a record saved before `mode` existed, instead of silently defaulting to one', async () => {
      const legacyRecord = {
        id: 'legacy-id',
        name: 'Old Template',
        createdAt: Date.now(),
        imageBlob: new Blob(['fake-png-bytes'], { type: 'image/png' }),
        // `mode` intentionally omitted, as with any record saved before it existed.
      } as unknown as Parameters<typeof buildCustomTemplate>[0];

      const template = await buildCustomTemplate(legacyRecord);
      // Whichever mode detection lands on, the template built from it must
      // still be internally consistent (exactly one of the two draw paths set).
      const isBackground = template.background.kind === 'pattern' && !template.overlayDraw;
      const isOverlay = template.background.kind === 'solid' && !!template.overlayDraw;
      expect(isBackground || isOverlay).toBe(true);
    });

    it('persists the re-detected mode so a legacy record only has to be re-detected once', async () => {
      const updateSpy = vi.spyOn(customTemplateStore, 'updateCustomTemplate');
      const legacyRecord = {
        id: 'legacy-id-2',
        name: 'Old Template',
        createdAt: Date.now(),
        imageBlob: new Blob(['fake-png-bytes'], { type: 'image/png' }),
      } as unknown as Parameters<typeof buildCustomTemplate>[0];

      await buildCustomTemplate(legacyRecord);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      const persisted = updateSpy.mock.calls[0]?.[0];
      expect(persisted?.id).toBe('legacy-id-2');
      expect(['overlay', 'background']).toContain(persisted?.mode);

      updateSpy.mockRestore();
    });
  });
});
