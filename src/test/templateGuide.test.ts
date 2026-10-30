import { describe, expect, it } from 'vitest';
import { renderTemplateGuide } from '../lib/templateGuide';
import { BASE_HEIGHT, BASE_WIDTH } from '../lib/layout';

describe('renderTemplateGuide', () => {
  it('renders a canvas at the base 600x1800 size', () => {
    const canvas = renderTemplateGuide();
    expect(canvas.width).toBe(BASE_WIDTH);
    expect(canvas.height).toBe(BASE_HEIGHT);
  });

  it('does not throw', () => {
    expect(() => renderTemplateGuide()).not.toThrow();
  });
});
