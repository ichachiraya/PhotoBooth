import type { Template } from '../types';
import { type StoredCustomTemplate, updateCustomTemplate } from './customTemplateStore';
import { defaultSlotLayout, BASE_HEIGHT, BASE_WIDTH } from './layout';
import { detectTemplateOverlayMode, type TemplateOverlayMode } from './templateOverlayDetection';

const { slots, caption } = defaultSlotLayout();

/**
 * Builds a `Template` from an already-decoded bitmap and a chosen draw
 * mode — shared by the live preview in ImportTemplateDialog (before
 * anything is saved) and buildCustomTemplate (loading a saved one). The
 * rest of the app (compositor, thumbnails, picker, edit/save steps)
 * never needs to know a template is "custom" vs. built-in.
 *
 * 'background' draws the design first, with photos always on top of it
 * in their slots — safe regardless of transparency, but nothing can
 * overlap the photo. 'overlay' draws it last instead, on top of the
 * photos, so a design with transparent windows can genuinely overlap the
 * photo edges (a frame lip, a corner sticker, a banner) the way a real
 * printed photo frame does.
 */
export function buildTemplateFromBitmap(
  bitmap: ImageBitmap,
  mode: TemplateOverlayMode,
  id: string,
  name: string,
): Template {
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.drawImage(bitmap, 0, 0, w, h);
  };

  return {
    id,
    name: { en: name, th: name },
    background:
      mode === 'background' ? { kind: 'pattern', draw } : { kind: 'solid', color: '#FAF6EF' },
    slots,
    overlayDraw: mode === 'overlay' ? draw : undefined,
    caption,
    font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
  };
}

/** Turns a stored custom template record into an ordinary `Template`. */
export async function buildCustomTemplate(stored: StoredCustomTemplate): Promise<Template> {
  const bitmap = await createImageBitmap(stored.imageBlob);

  let mode: TemplateOverlayMode;
  if (stored.mode === 'overlay' || stored.mode === 'background') {
    mode = stored.mode;
  } else {
    // A record saved before `mode` existed — detect it now instead of
    // silently defaulting to 'background' forever, and persist the fix
    // so this only has to happen once per legacy template.
    const canvas = document.createElement('canvas');
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(bitmap, 0, 0, BASE_WIDTH, BASE_HEIGHT);
    mode = detectTemplateOverlayMode(canvas);
    void updateCustomTemplate({ ...stored, mode });
  }

  return buildTemplateFromBitmap(bitmap, mode, `custom-${stored.id}`, stored.name);
}
