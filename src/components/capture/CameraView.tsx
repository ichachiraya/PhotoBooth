import type { RefObject } from 'react';
import { CountdownOverlay } from './CountdownOverlay';
import { FlashOverlay } from './FlashOverlay';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  mirrored: boolean;
  countdown: number | null;
  flashKey: number;
}

/**
 * The live camera preview, framed like a printed photo (thin border, soft
 * edge). `playsinline` + `muted` + `autoPlay` are required for iOS Safari
 * to actually render the stream instead of a black box.
 */
export function CameraView({ videoRef, mirrored, countdown, flashKey }: CameraViewProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-bg p-2 shadow-[0_1px_3px_rgba(59,54,49,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`h-full w-full object-cover ${mirrored ? '-scale-x-100' : ''}`}
        />
        {countdown !== null && <CountdownOverlay count={countdown} />}
        <FlashOverlay flashKey={flashKey} />
      </div>
    </div>
  );
}
