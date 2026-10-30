/** Shared domain types for the photo booth app. */

/** The 3 steps of the booth flow (template picking happens first, then capture). */
export type Step = 'template' | 'capture' | 'edit' | 'save';

export interface SlotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CaptionArea {
  x: number;
  y: number;
  width: number;
  height: number;
  align: 'left' | 'center' | 'right';
}

export interface TemplateBackground {
  kind: 'solid' | 'gradient' | 'pattern';
  color?: string;
  gradient?: { from: string; to: string; direction: 'vertical' | 'horizontal' };
  /** For 'pattern' backgrounds (e.g. film sprocket holes) drawn directly on canvas. */
  draw?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

export interface Template {
  id: string;
  name: { en: string; th: string };
  /** Short description shown under the template name in the picker. */
  description?: { en: string; th: string };
  background: TemplateBackground;
  /** Exactly 3 rects, authored at BASE_WIDTH x BASE_HEIGHT (see lib/layout.ts). */
  slots: [SlotRect, SlotRect, SlotRect];
  /** Frame lines, sprocket holes, floral line-art — drawn after photos, before caption. */
  overlayDraw?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  caption: CaptionArea;
  font: {
    family: string;
    size: number;
    color: string;
  };
}

export type FilterId = 'none' | 'bw' | 'sepia' | 'vintage' | 'contrast' | 'warm' | 'cool';

export type CameraFacing = 'user' | 'environment';

/** A single filled photo slot: either a camera capture or an imported+cropped image. */
export interface SlotPhoto {
  /** Decoded, already-oriented, already-downscaled bitmap ready for compositing. */
  bitmap: ImageBitmap;
  source: 'camera' | 'import';
}

export type SlotPhotos = [SlotPhoto | null, SlotPhoto | null, SlotPhoto | null];

export interface StripOptions {
  filter: FilterId;
  caption: string;
  showDateStamp: boolean;
  mirrorExport: boolean;
  highQuality: boolean;
}

export type OutputFormat = 'png' | 'jpg';
