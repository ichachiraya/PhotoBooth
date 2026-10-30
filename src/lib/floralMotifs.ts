/**
 * Simple, code-drawn botanical line-art (stem + a few leaves + small round
 * flower heads) used by the two floral templates' canvas overlay. Mirrors
 * the look of FloralBackground's SVG sprigs but rendered with Canvas 2D so
 * it composites directly into the exported strip.
 */
export interface SprigOptions {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  color: string;
  opacity?: number;
}

function drawSprig(ctx: CanvasRenderingContext2D, options: SprigOptions) {
  const { x, y, scale = 1, rotation = 0, color, opacity = 1 } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';

  // stem
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(10, 30, 4, 0);
  ctx.stroke();

  // leaves (small curved strokes branching off the stem)
  ctx.beginPath();
  ctx.moveTo(6, 44);
  ctx.quadraticCurveTo(20, 40, 24, 30);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5, 24);
  ctx.quadraticCurveTo(-8, 20, -14, 10);
  ctx.stroke();

  // flower head: a small cluster of circles
  ctx.beginPath();
  ctx.arc(4, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(10, -4, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-2, -5, 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Loosely scatters sprigs along the left and right margins of the canvas,
 * echoing the app's background botanicals but drawn into the strip itself.
 */
export function drawFloralBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  opacity = 0.5,
) {
  const positions: SprigOptions[] = [
    { x: 14, y: 90, scale: 0.9, rotation: 0.15, color, opacity },
    { x: w - 14, y: 260, scale: 0.8, rotation: -2.7, color, opacity },
    { x: 16, y: 760, scale: 0.75, rotation: 0.4, color, opacity },
    { x: w - 16, y: 900, scale: 0.95, rotation: -3.0, color, opacity },
    { x: 14, y: h - 420, scale: 0.8, rotation: 0.2, color, opacity },
    { x: w - 14, y: h - 260, scale: 0.85, rotation: -2.9, color, opacity },
  ];
  positions.forEach((p) => drawSprig(ctx, p));
}
