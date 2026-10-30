/**
 * Brief soft white fade over the preview at the moment of capture.
 * `flashKey` changes on every capture so the fade re-triggers each shot.
 */
export function FlashOverlay({ flashKey }: { flashKey: number }) {
  if (flashKey === 0) return null;
  return (
    <div
      key={flashKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 animate-[flash-fade_260ms_ease-out] bg-bg"
    />
  );
}
