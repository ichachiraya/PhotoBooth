import { useEffect, useRef } from 'react';
import type { SlotPhotos, Template } from '../../types';
import { renderStrip, type CompositeOptions } from '../../lib/compositor';
import { BASE_HEIGHT, BASE_WIDTH } from '../../lib/layout';

interface TemplateThumbnailProps {
  template: Template;
  photos: SlotPhotos;
  width?: number;
  /** Filter/caption/mirror settings to preview (the template picker leaves these at their defaults). */
  options?: Omit<CompositeOptions, 'scale' | 'highQuality'>;
}

/**
 * A live preview of a template rendered with the user's current photos
 * (or just the template's own background/frame when slots are still
 * empty — an empty frame reads fine as a "no photo yet" placeholder).
 */
export function TemplateThumbnail({
  template,
  photos,
  width = 110,
  options,
}: TemplateThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = Math.round(width * (BASE_HEIGHT / BASE_WIDTH));

  useEffect(() => {
    const displayCanvas = canvasRef.current;
    if (!displayCanvas) return;
    const scale = width / BASE_WIDTH;
    const rendered = renderStrip(template, photos, { scale, ...options });
    displayCanvas.width = rendered.width;
    displayCanvas.height = rendered.height;
    const ctx = displayCanvas.getContext('2d');
    ctx?.drawImage(rendered, 0, 0);
  }, [template, photos, width, options]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block rounded-[var(--radius-sm)]"
      aria-hidden="true"
    />
  );
}
