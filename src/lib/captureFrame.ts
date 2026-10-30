/**
 * Grabs the current frame of a live <video> element as an ImageBitmap.
 * Canvas drawImage reads the underlying video frame data, not the element's
 * CSS transform — so this is unaffected by preview-mirroring and always
 * returns the camera's raw (unflipped) frame. Export-time mirroring is
 * applied later, deliberately, by the compositor.
 */
export async function captureFrameFromVideo(video: HTMLVideoElement): Promise<ImageBitmap> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return createImageBitmap(canvas);
}
