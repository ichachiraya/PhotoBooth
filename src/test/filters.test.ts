import { describe, expect, it } from 'vitest';
import { applyFilterToImageData, FILTER_LABELS, FILTER_ORDER } from '../lib/filters';
import type { FilterId } from '../types';

describe('filter selection', () => {
  it('defines a label and ordering entry for every FilterId', () => {
    const expected: FilterId[] = ['none', 'bw', 'sepia', 'vintage', 'contrast', 'warm', 'cool'];
    for (const id of expected) {
      expect(FILTER_LABELS[id].en.length).toBeGreaterThan(0);
      expect(FILTER_LABELS[id].th.length).toBeGreaterThan(0);
      expect(FILTER_ORDER).toContain(id);
    }
  });

  function makeImageData(pixels: number[][]): ImageData {
    const data = new Uint8ClampedArray(pixels.length * 4);
    pixels.forEach(([r, g, b], i) => {
      data[i * 4] = r!;
      data[i * 4 + 1] = g!;
      data[i * 4 + 2] = b!;
      data[i * 4 + 3] = 255;
    });
    return { data, width: pixels.length, height: 1, colorSpace: 'srgb' } as ImageData;
  }

  it('"none" leaves pixel data untouched', () => {
    const imageData = makeImageData([[10, 150, 240]]);
    const before = [...imageData.data];
    applyFilterToImageData(imageData, 'none');
    expect([...imageData.data]).toEqual(before);
  });

  it('"bw" sets all three channels to the same gray value', () => {
    const imageData = makeImageData([[200, 100, 50]]);
    applyFilterToImageData(imageData, 'bw');
    const [r, g, b] = imageData.data;
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('"sepia" pushes a pure blue pixel toward warm tones (less blue than red)', () => {
    const imageData = makeImageData([[0, 0, 255]]);
    applyFilterToImageData(imageData, 'sepia');
    const [r, , b] = imageData.data;
    expect(r!).toBeGreaterThan(b!);
  });

  it('"contrast" pushes a mid-gray pixel further from 128 only when not already neutral', () => {
    const imageData = makeImageData([[180, 180, 180]]);
    applyFilterToImageData(imageData, 'contrast');
    expect(imageData.data[0]!).toBeGreaterThan(180);
  });

  it('"warm" increases red and reduces blue relative to the original', () => {
    const imageData = makeImageData([[100, 100, 100]]);
    applyFilterToImageData(imageData, 'warm');
    expect(imageData.data[0]!).toBeGreaterThan(100);
    expect(imageData.data[2]!).toBeLessThan(100);
  });

  it('"cool" reduces red and increases blue relative to the original', () => {
    const imageData = makeImageData([[100, 100, 100]]);
    applyFilterToImageData(imageData, 'cool');
    expect(imageData.data[0]!).toBeLessThan(100);
    expect(imageData.data[2]!).toBeGreaterThan(100);
  });
});
