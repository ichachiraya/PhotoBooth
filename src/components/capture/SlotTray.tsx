import { RotateCcw } from 'lucide-react';
import type { SlotPhotos } from '../../types';
import { BitmapThumbnail } from '../ui/BitmapThumbnail';
import { ImportButton } from '../import/ImportButton';
import { useI18n } from '../../i18n/useI18n';

interface SlotTrayProps {
  photos: SlotPhotos;
  activeSlot: number | null;
  onRetake: (slotIndex: number) => void;
  onImportFile: (slotIndex: number, file: File) => void;
  cameraAvailable: boolean;
  disabled?: boolean;
}

/**
 * Three slot thumbnails. Each slot can be filled independently by camera
 * (Retake) or by importing an image (Import) — so camera and imported
 * photos can be freely mixed across the 3 slots, and importing is always
 * available as a fallback when the camera itself can't be used.
 */
export function SlotTray({
  photos,
  activeSlot,
  onRetake,
  onImportFile,
  cameraAvailable,
  disabled,
}: SlotTrayProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo, index) => {
        const isActive = activeSlot === index;
        return (
          <div
            key={index}
            className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] border ${
              isActive ? 'border-sage' : 'border-line'
            } bg-surface`}
          >
            {photo ? (
              <BitmapThumbnail bitmap={photo.bitmap} mirrored={photo.source === 'camera'} />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-serif text-lg text-text-secondary">
                {index + 1}
              </span>
            )}

            <div className="absolute bottom-1 right-1 flex gap-1">
              {cameraAvailable && (
                <button
                  type="button"
                  onClick={() => onRetake(index)}
                  disabled={disabled}
                  aria-label={`${t.common.retake} ${index + 1}`}
                  title={t.common.retake}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-bg/85 text-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={14} strokeWidth={1.5} />
                </button>
              )}
              <ImportButton
                disabled={disabled}
                onFileSelected={(file) => onImportFile(index, file)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
