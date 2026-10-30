import type { FilterId } from '../types';

export const FILTER_ORDER: FilterId[] = [
  'none',
  'bw',
  'sepia',
  'vintage',
  'contrast',
  'warm',
  'cool',
];

export const FILTER_LABELS: Record<FilterId, { en: string; th: string }> = {
  none: { en: 'None', th: 'ไม่มี' },
  bw: { en: 'B&W', th: 'ขาวดำ' },
  sepia: { en: 'Sepia', th: 'เซปีย' },
  vintage: { en: 'Vintage', th: 'วินเทจ' },
  contrast: { en: 'High contrast', th: 'คอนทราสต์สูง' },
  warm: { en: 'Warm', th: 'อุ่น' },
  cool: { en: 'Cool', th: 'เย็น' },
};

function clamp(v: number): number {
  return Math.max(0, Math.min(255, v));
}

/**
 * Applies one of the 7 looks via direct per-pixel channel math (used for
 * every photo, in every browser — see compositor.ts's filterCroppedSource).
 * Mutates `imageData` in place.
 */
export function applyFilterToImageData(imageData: ImageData, filter: FilterId): void {
  if (filter === 'none') return;
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;

    switch (filter) {
      case 'bw': {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
        break;
      }
      case 'sepia': {
        data[i] = clamp(0.393 * r + 0.769 * g + 0.189 * b);
        data[i + 1] = clamp(0.349 * r + 0.686 * g + 0.168 * b);
        data[i + 2] = clamp(0.272 * r + 0.534 * g + 0.131 * b);
        break;
      }
      case 'vintage': {
        const sr = 0.393 * r + 0.769 * g + 0.189 * b;
        const sg = 0.349 * r + 0.686 * g + 0.168 * b;
        const sb = 0.272 * r + 0.534 * g + 0.131 * b;
        data[i] = clamp(sr * 0.85 + 20);
        data[i + 1] = clamp(sg * 0.85 + 15);
        data[i + 2] = clamp(sb * 0.85 + 8);
        break;
      }
      case 'contrast': {
        const factor = 1.4;
        data[i] = clamp((r - 128) * factor + 128);
        data[i + 1] = clamp((g - 128) * factor + 128);
        data[i + 2] = clamp((b - 128) * factor + 128);
        break;
      }
      case 'warm': {
        data[i] = clamp(r * 1.08);
        data[i + 2] = clamp(b * 0.92);
        break;
      }
      case 'cool': {
        data[i] = clamp(r * 0.95);
        data[i + 2] = clamp(b * 1.08);
        break;
      }
      default:
        break;
    }
  }
}
