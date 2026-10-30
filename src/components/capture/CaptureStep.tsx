import { useRef, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useCountdown } from '../../hooks/useCountdown';
import { captureFrameFromVideo } from '../../lib/captureFrame';
import { cropCanvasToBitmap, decodeImportedFile } from '../../lib/importImage';
import type { Area } from 'react-easy-crop';
import type { CameraFacing, SlotPhotos } from '../../types';
import { CameraView } from './CameraView';
import { CameraPermissionError } from './CameraPermissionError';
import { SlotTray } from './SlotTray';
import { CaptureSettings } from './CaptureSettings';
import { CropDialog } from '../import/CropDialog';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n/useI18n';

const SLOT_ASPECT = 4 / 3;

interface PendingImport {
  slotIndex: number;
  canvas: HTMLCanvasElement;
  objectUrl: string;
}

interface CaptureStepProps {
  photos: SlotPhotos;
  onPhotosChange: (next: SlotPhotos) => void;
}

/**
 * The capture screen: live camera preview, 3-2-1 countdown with flash,
 * sequential capture of all 3 slots on "Start", and independent per-slot
 * retake. Importing images into a slot is wired in a later milestone —
 * CameraPermissionError already explains that path is coming for anyone
 * who can't use the camera at all.
 */
export function CaptureStep({ photos, onPhotosChange }: CaptureStepProps) {
  const { t, lang } = useI18n();

  const [facing, setFacing] = useState<CameraFacing>('user');
  const [mirrored, setMirrored] = useState(true); // default: mirrored for front camera
  const [countdownSeconds, setCountdownSeconds] = useState<3 | 5 | 10>(3);
  const [flashKey, setFlashKey] = useState(0);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);

  const isSequenceRef = useRef(false);

  const { videoRef, error, isLoading, hasMultipleCameras } = useCamera(facing);

  const handleCountdownComplete = () => {
    const slotIndex = activeSlot;
    if (slotIndex === null) return;
    setFlashKey((k) => k + 1);
    void captureSlot(slotIndex);

    window.setTimeout(() => {
      const next = slotIndex + 1;
      if (isSequenceRef.current && next < photos.length) {
        runSlot(next);
      } else {
        isSequenceRef.current = false;
        setActiveSlot(null);
      }
    }, 280);
  };

  const { count, start: startCountdown } = useCountdown(countdownSeconds, handleCountdownComplete);

  async function captureSlot(slotIndex: number) {
    const video = videoRef.current;
    if (!video) return;
    try {
      const bitmap = await captureFrameFromVideo(video);
      const next = [...photos] as SlotPhotos;
      next[slotIndex] = { bitmap, source: 'camera' };
      onPhotosChange(next);
    } catch {
      // Capture failed (e.g. video not ready) — slot just stays as-is, user can retry.
    }
  }

  function runSlot(slotIndex: number) {
    setActiveSlot(slotIndex);
    startCountdown();
  }

  function handleStart() {
    isSequenceRef.current = true;
    runSlot(0);
  }

  function handleRetake(slotIndex: number) {
    isSequenceRef.current = false;
    runSlot(slotIndex);
  }

  async function handleImportFile(slotIndex: number, file: File) {
    try {
      const { canvas, objectUrl } = await decodeImportedFile(file);
      setPendingImport({ slotIndex, canvas, objectUrl });
    } catch {
      // Unreadable/corrupt file — silently ignore, user can pick another.
    }
  }

  function closePendingImport() {
    if (pendingImport) URL.revokeObjectURL(pendingImport.objectUrl);
    setPendingImport(null);
  }

  async function handleCropConfirm(area: Area) {
    if (!pendingImport) return;
    const { slotIndex, canvas } = pendingImport;
    try {
      const bitmap = await cropCanvasToBitmap(canvas, area);
      const next = [...photos] as SlotPhotos;
      next[slotIndex] = { bitmap, source: 'import' };
      onPhotosChange(next);
    } finally {
      closePendingImport();
    }
  }

  function handleSwitchCamera() {
    const next: CameraFacing = facing === 'user' ? 'environment' : 'user';
    setFacing(next);
    setMirrored(next === 'user'); // default: mirrored only for the front camera
  }

  const allFilled = photos.every((p) => p !== null);
  const isBusy = count !== null;

  return (
    <div className="flex flex-col gap-5">
      {error ? (
        <CameraPermissionError kind={error.kind} />
      ) : (
        <CameraView videoRef={videoRef} mirrored={mirrored} countdown={count} flashKey={flashKey} />
      )}

      {!error && (
        <CaptureSettings
          countdownSeconds={countdownSeconds}
          onCountdownChange={setCountdownSeconds}
          mirrored={mirrored}
          onToggleMirror={() => setMirrored((m) => !m)}
          canSwitchCamera={hasMultipleCameras}
          onSwitchCamera={handleSwitchCamera}
          disabled={isBusy}
        />
      )}

      <SlotTray
        photos={photos}
        activeSlot={activeSlot}
        onRetake={handleRetake}
        onImportFile={handleImportFile}
        cameraAvailable={!error}
        disabled={isBusy}
      />

      {!error && !allFilled && (
        <Button onClick={handleStart} disabled={isLoading || isBusy} className="w-full">
          {lang === 'th' ? 'เริ่มถ่ายภาพ' : 'Start capture'}
        </Button>
      )}
      {!error && allFilled && (
        <p className="text-center text-sm text-text-secondary">
          {lang === 'th'
            ? `แตะ "${t.common.retake}" เพื่อถ่ายใหม่ทีละภาพ`
            : `Tap "${t.common.retake}" on any shot to redo just that one.`}
        </p>
      )}

      {pendingImport && (
        <CropDialog
          imageUrl={pendingImport.objectUrl}
          aspect={SLOT_ASPECT}
          onCancel={closePendingImport}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
