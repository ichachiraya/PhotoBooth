import { describe, expect, it } from 'vitest';
import {
  classifyOverlayMode,
  detectTemplateOverlayMode,
  OVERLAY_ALPHA_THRESHOLD,
} from '../lib/templateOverlayDetection';

describe('classifyOverlayMode', () => {
  it('classifies a fully transparent window as "overlay"', () => {
    const samples = new Array(1000).fill(0);
    expect(classifyOverlayMode(samples)).toBe('overlay');
  });

  it('classifies a fully opaque window as "background"', () => {
    const samples = new Array(1000).fill(255);
    expect(classifyOverlayMode(samples)).toBe('background');
  });

  it('classifies a mostly-transparent (40% opaque) window as "overlay"', () => {
    const samples = new Array(1000).fill(Math.round(255 * 0.4));
    expect(classifyOverlayMode(samples)).toBe('overlay');
  });

  it('classifies a mostly-opaque (60% opaque) window as "background"', () => {
    const samples = new Array(1000).fill(Math.round(255 * 0.6));
    expect(classifyOverlayMode(samples)).toBe('background');
  });

  it('a small opaque decoration inside an otherwise transparent window still reads as "overlay"', () => {
    // 95% fully transparent, 5% a fully opaque little sticker/logo.
    const samples = [...new Array(950).fill(0), ...new Array(50).fill(255)];
    expect(classifyOverlayMode(samples)).toBe('overlay');
  });

  it('a small transparent gap inside an otherwise opaque design still reads as "background"', () => {
    // Mirror case: mostly opaque, with only a small transparent notch.
    const samples = [...new Array(950).fill(255), ...new Array(50).fill(0)];
    expect(classifyOverlayMode(samples)).toBe('background');
  });

  it('treats no samples at all as "background" (the safe default)', () => {
    expect(classifyOverlayMode([])).toBe('background');
  });

  it('is consistent with its own documented threshold', () => {
    const justBelow = new Array(100).fill(OVERLAY_ALPHA_THRESHOLD - 1);
    const justAtOrAbove = new Array(100).fill(OVERLAY_ALPHA_THRESHOLD);
    expect(classifyOverlayMode(justBelow)).toBe('overlay');
    expect(classifyOverlayMode(justAtOrAbove)).toBe('background');
  });
});

describe('detectTemplateOverlayMode', () => {
  it('samples a real canvas and returns a valid mode without throwing', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1800;
    const mode = detectTemplateOverlayMode(canvas);
    expect(['overlay', 'background']).toContain(mode);
  });
});
