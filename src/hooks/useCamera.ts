import { useEffect, useRef, useState } from 'react';
import type { CameraFacing } from '../types';

export type CameraErrorKind =
  'denied' | 'not-found' | 'in-use' | 'insecure' | 'unsupported' | 'unknown';

export interface CameraError {
  kind: CameraErrorKind;
}

function mapGetUserMediaError(err: unknown): CameraError {
  const name = err instanceof DOMException ? err.name : '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return { kind: 'denied' };
    case 'NotFoundError':
    case 'OverconstrainedError':
      return { kind: 'not-found' };
    case 'NotReadableError':
    case 'TrackStartError':
    case 'AbortError':
      return { kind: 'in-use' };
    default:
      return { kind: 'unknown' };
  }
}

interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  error: CameraError | null;
  isLoading: boolean;
  hasMultipleCameras: boolean;
}

/**
 * Owns the getUserMedia lifecycle for a single live camera stream: requests
 * the stream for the given facing mode, attaches it to a <video> element,
 * and tears down every track whenever the facing mode changes or the
 * component using this hook unmounts (e.g. leaving the capture screen).
 */
export function useCamera(facing: CameraFacing): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<CameraError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setIsLoading(true);
      setError(null);

      if (!window.isSecureContext) {
        setError({ kind: 'insecure' });
        setIsLoading(false);
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError({ kind: 'unsupported' });
        setIsLoading(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          if (!cancelled) {
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            setHasMultipleCameras(videoInputs.length > 1);
          }
        } catch {
          // enumerateDevices failing is non-fatal — facing switch button just won't show.
        }
      } catch (err) {
        if (!cancelled) {
          setError(mapGetUserMediaError(err));
          setIsLoading(false);
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [facing]);

  return { videoRef, error, isLoading, hasMultipleCameras };
}
