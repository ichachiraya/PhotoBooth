import { useState } from 'react';
import type { OutputFormat, SlotPhotos, StripOptions, Template } from '../../types';
import { canShareFiles, downloadBlob, exportStrip, shareBlob } from '../../lib/download';
import { isIOS } from '../../lib/platform';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { useI18n } from '../../i18n/useI18n';

interface SaveActionsProps {
  template: Template;
  photos: SlotPhotos;
  options: StripOptions;
  onOptionsChange: (next: StripOptions) => void;
  onSaved: () => void;
}

/** Format/quality controls, plus Download and (when available) Share. */
export function SaveActions({
  template,
  photos,
  options,
  onOptionsChange,
  onSaved,
}: SaveActionsProps) {
  const { lang } = useI18n();
  const [format, setFormat] = useState<OutputFormat>('png');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareAvailable = canShareFiles();
  const preferShare = shareAvailable && isIOS();

  async function runExport() {
    return exportStrip(template, photos, { ...options, highQuality: options.highQuality }, format);
  }

  async function handleDownload() {
    setIsBusy(true);
    setError(null);
    try {
      const { blob, filename } = await runExport();
      downloadBlob(blob, filename);
      onSaved();
    } catch {
      setError(lang === 'th' ? 'บันทึกไม่สำเร็จ ลองอีกครั้ง' : 'Could not save. Please try again.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleShare() {
    setIsBusy(true);
    setError(null);
    try {
      const { blob, filename } = await runExport();
      const shared = await shareBlob(blob, filename, 'Photo Booth');
      if (!shared) downloadBlob(blob, filename); // not usable here — fall back to a direct download
      onSaved();
    } catch {
      setError(lang === 'th' ? 'บันทึกไม่สำเร็จ ลองอีกครั้ง' : 'Could not save. Please try again.');
    } finally {
      setIsBusy(false);
    }
  }

  const primaryLabel = lang === 'th' ? 'บันทึก' : 'Download';
  const shareLabel = lang === 'th' ? 'แชร์' : 'Share';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="u-label">{lang === 'th' ? 'รูปแบบ' : 'Format'}</span>
          <select
            value={format}
            disabled={isBusy}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="rounded-[var(--radius-sm)] border border-line bg-bg px-2 py-1 text-text disabled:opacity-40"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          {lang === 'th' ? 'คุณภาพสูง (1200×3600)' : 'High quality (1200×3600)'}
          <Toggle
            checked={options.highQuality}
            onChange={(highQuality) => onOptionsChange({ ...options, highQuality })}
            label={lang === 'th' ? 'คุณภาพสูง' : 'High quality'}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {preferShare ? (
          <>
            <Button onClick={handleShare} disabled={isBusy} className="flex-1">
              {shareLabel}
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownload}
              disabled={isBusy}
              className="flex-1"
            >
              {primaryLabel}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleDownload} disabled={isBusy} className="flex-1">
              {primaryLabel}
            </Button>
            {shareAvailable && (
              <Button
                variant="secondary"
                onClick={handleShare}
                disabled={isBusy}
                className="flex-1"
              >
                {shareLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
