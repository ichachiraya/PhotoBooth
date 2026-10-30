import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import type { SlotPhotos } from '../../types';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { TemplateThumbnail } from './TemplateThumbnail';
import { useI18n } from '../../i18n/useI18n';
import { downloadTemplateGuide } from '../../lib/templateGuide';
import {
  canvasToPngBlob,
  MAX_TEMPLATE_FILE_BYTES,
  normalizeCustomTemplateImage,
} from '../../lib/customTemplateImage';
import {
  detectTemplateOverlayMode,
  type TemplateOverlayMode,
} from '../../lib/templateOverlayDetection';
import { buildTemplateFromBitmap } from '../../lib/customTemplateFactory';
import type { AddCustomTemplateInput } from '../../hooks/useCustomTemplates';

interface ImportTemplateDialogProps {
  photos: SlotPhotos;
  onCancel: () => void;
  onImport: (input: AddCustomTemplateInput) => Promise<void>;
}

interface ProcessedUpload {
  bitmap: ImageBitmap;
  blob: Blob;
}

/**
 * Popup for importing a user-designed template: download the layout
 * guide, name it, upload the PNG they designed around it. The upload is
 * decoded and transparency-checked immediately (detectTemplateOverlayMode)
 * so a live preview — rendered with the person's actual photos, via the
 * same TemplateThumbnail every other preview uses — shows up right away,
 * with a one-line note + toggle in case the detected mode is wrong.
 */
export function ImportTemplateDialog({ photos, onCancel, onImport }: ImportTemplateDialogProps) {
  const { t, lang } = useI18n();
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState<ProcessedUpload | null>(null);
  const [mode, setMode] = useState<TemplateOverlayMode>('background');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // The preview bitmap is transient (dialog-local) — release it whenever
  // it's replaced by a new upload, and on unmount.
  useEffect(() => {
    return () => processed?.bitmap.close();
  }, [processed]);

  async function handleFileChange(selected: File | undefined) {
    setError(null);
    setProcessed(null);
    if (!selected) return;

    if (selected.size > MAX_TEMPLATE_FILE_BYTES) {
      setError(t.customTemplate.errorTooLarge);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    try {
      const canvas = await normalizeCustomTemplateImage(selected);
      const detectedMode = detectTemplateOverlayMode(canvas);
      const [bitmap, blob] = await Promise.all([
        createImageBitmap(canvas),
        canvasToPngBlob(canvas),
      ]);
      setMode(detectedMode);
      setProcessed({ bitmap, blob });
    } catch {
      setError(t.customTemplate.errorGeneric);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDownloadGuide() {
    try {
      await downloadTemplateGuide(lang);
    } catch {
      setError(t.customTemplate.errorGeneric);
    }
  }

  async function handleSave() {
    if (!processed || !name.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await onImport({ name: name.trim(), mode, imageBlob: processed.blob });
    } catch {
      setError(t.customTemplate.errorGeneric);
      setIsSaving(false);
    }
  }

  const canSave = !!processed && name.trim().length > 0 && !isSaving;
  const previewTemplate = processed
    ? buildTemplateFromBitmap(
        processed.bitmap,
        mode,
        'preview',
        name.trim() || t.customTemplate.previewLabel,
      )
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.customTemplate.dialogTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4"
    >
      <div className="flex max-h-[90vh] w-full max-w-[420px] flex-col overflow-y-auto rounded-[var(--radius-md)] border border-line bg-bg p-5">
        <h2 className="font-serif text-xl text-text">{t.customTemplate.dialogTitle}</h2>
        <p className="mt-2 text-sm text-text-secondary">{t.customTemplate.instructions}</p>

        <Button variant="secondary" onClick={handleDownloadGuide} className="mt-4 w-full gap-2">
          <Download size={16} strokeWidth={1.5} />
          {t.customTemplate.downloadGuide}
        </Button>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="u-label text-text-secondary">{t.customTemplate.nameLabel}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.customTemplate.namePlaceholder}
              maxLength={40}
              className="rounded-[var(--radius-sm)] border border-line bg-bg px-3 py-2 text-text placeholder:text-text-secondary"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="u-label text-text-secondary">{t.customTemplate.fileLabel}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/*"
              onChange={(e) => void handleFileChange(e.target.files?.[0])}
              className="text-sm text-text file:mr-3 file:rounded-[var(--radius-sm)] file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-sm file:text-text"
            />
          </label>

          {isProcessing && (
            <p className="text-sm text-text-secondary">{t.customTemplate.detecting}</p>
          )}

          {processed && !isProcessing && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2">
                <span className="text-sm text-text">
                  {mode === 'overlay'
                    ? t.customTemplate.modeOverlay
                    : t.customTemplate.modeBackground}
                </span>
                <Toggle
                  checked={mode === 'overlay'}
                  onChange={(checked) => setMode(checked ? 'overlay' : 'background')}
                  label={t.customTemplate.modeToggleLabel}
                />
              </div>

              {previewTemplate && (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="u-label text-text-secondary">
                    {t.customTemplate.previewLabel}
                  </span>
                  <div className="overflow-hidden rounded-[var(--radius-sm)] border border-line bg-bg p-1.5">
                    <TemplateThumbnail template={previewTemplate} photos={photos} width={140} />
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <p role="alert" className="text-sm text-rose">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" onClick={() => void handleSave()} disabled={!canSave}>
            {isSaving ? t.customTemplate.saving : t.customTemplate.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
