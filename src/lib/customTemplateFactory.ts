import type { Template } from '../types';
import type { StoredCustomTemplate } from './customTemplateStore';
import { defaultSlotLayout } from './layout';

const { slots, caption } = defaultSlotLayout();

/**
 * Turns a stored custom template record into an ordinary `Template` —
 * the rest of the app (compositor, thumbnails, picker, edit/save steps)
 * never needs to know a template is "custom" vs. built-in.
 *
 * The uploaded PNG is drawn as the *background* (a 'pattern' background
 * whose draw callback just blits the bitmap), and photos always draw on
 * top of it in their fixed slots — so there's no dependency on the
 * person's file actually having real transparency in the window areas.
 * Whatever they put there (even a solid fill) just gets covered by the
 * photo; only the art outside the windows ever shows.
 */
export async function buildCustomTemplate(stored: StoredCustomTemplate): Promise<Template> {
  const bitmap = await createImageBitmap(stored.imageBlob);

  return {
    id: `custom-${stored.id}`,
    name: { en: stored.name, th: stored.name },
    background: {
      kind: 'pattern',
      draw: (ctx, w, h) => {
        ctx.drawImage(bitmap, 0, 0, w, h);
      },
    },
    slots,
    caption,
    font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
  };
}
