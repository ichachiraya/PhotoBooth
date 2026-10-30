/**
 * iOS Safari's direct-download (anchor `download`) behavior is unreliable
 * (it often just opens the image in a new tab instead), so the save
 * screen prefers the native share sheet there when it's available.
 */
export function isIOS(): boolean {
  const ua = navigator.userAgent;
  if (/iP(hone|ad|od)/.test(ua)) return true;
  // iPadOS 13+ reports as "MacIntel" but is touch-capable, unlike a real Mac.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}
