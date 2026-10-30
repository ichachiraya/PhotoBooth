import { useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n/useI18n';

interface CropDialogProps {
  imageUrl: string;
  /** width / height, e.g. 4/3 to match the slot shape. */
  aspect: number;
  onCancel: () => void;
  onConfirm: (areaPixels: Area) => void;
}

/**
 * A modal crop dialog locked to the slot's aspect ratio. react-easy-crop
 * reports the chosen crop as pixel coordinates against the full image it
 * was given — which here is already EXIF-corrected and downscaled — so
 * the caller can crop that same source directly with no extra scaling.
 */
export function CropDialog({ imageUrl, aspect, onCancel, onConfirm }: CropDialogProps) {
  const { lang } = useI18n();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'th' ? 'ครอปรูปภาพ' : 'Crop photo'}
      className="fixed inset-0 z-50 flex flex-col bg-text/85 p-4"
    >
      <div className="relative flex-1 overflow-hidden rounded-[var(--radius-md)] bg-black">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setAreaPixels(pixels)}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4 pt-4">
        <label className="flex items-center gap-3 text-sm text-bg">
          <span className="u-label shrink-0">{lang === 'th' ? 'ซูม' : 'Zoom'}</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
            aria-label={lang === 'th' ? 'ซูมรูปภาพ' : 'Zoom photo'}
          />
        </label>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} className="border-bg text-bg">
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            className="bg-bg text-text"
            disabled={!areaPixels}
            onClick={() => areaPixels && onConfirm(areaPixels)}
          >
            {lang === 'th' ? 'ใช้รูปนี้' : 'Use photo'}
          </Button>
        </div>
      </div>
    </div>
  );
}
