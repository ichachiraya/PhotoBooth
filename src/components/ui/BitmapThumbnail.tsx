import { useEffect, useRef } from 'react';

interface BitmapThumbnailProps {
  bitmap: ImageBitmap;
  className?: string;
  mirrored?: boolean;
}

/**
 * Draws an ImageBitmap into a <canvas> sized to its own CSS box (so it
 * works as a thumbnail wherever it's placed: slot tray, template picker,
 * strip preview). ImageBitmaps aren't directly usable as an <img src>,
 * so this is the shared way the app previews one.
 */
export function BitmapThumbnail({
  bitmap,
  className = '',
  mirrored = false,
}: BitmapThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    ctx.save();
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(bitmap, 0, 0);
    ctx.restore();
  }, [bitmap, mirrored]);

  return <canvas ref={canvasRef} className={`h-full w-full object-cover ${className}`} />;
}
