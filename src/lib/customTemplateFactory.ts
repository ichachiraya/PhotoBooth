import type { Template } from '../types';
import type { StoredCustomTemplate } from './customTemplateStore';
import { defaultSlotLayout } from './layout';

const { slots, caption } = defaultSlotLayout();

/**
 * Turns a stored custom template record into an ordinary `Template` —
 * the rest of the app (compositor, thumbnails, picker, edit/save steps)
 * never needs to know a template is "custom" vs. built-in. The uploaded
 * PNG becomes the overlay: drawn after photos, so it shows through
 * wherever the person left it transparent — same mechanism the built-in
 * templates use for frame lines, sprocket holes, and floral borders.
 */
export async function buildCustomTemplate(stored: StoredCustomTemplate): Promise<Template> {
  const bitmap = await createImageBitmap(stored.imageBlob);

  return {
    id: `custom-${stored.id}`,
    name: { en: stored.name, th: stored.name },
    background: { kind: 'solid', color: '#FAF6EF' },
    slots,
    overlayDraw: (ctx, w, h) => {
      ctx.drawImage(bitmap, 0, 0, w, h);
    },
    caption,
    font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
  };
}
