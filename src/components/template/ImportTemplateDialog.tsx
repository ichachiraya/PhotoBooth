import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n/useI18n';
import { downloadTemplateGuide } from '../../lib/templateGuide';
import { MAX_TEMPLATE_FILE_BYTES } from '../../lib/customTemplateImage';

interface ImportTemplateDialogProps {
  onCancel: () => void;
  onImport: (file: File, name: string) => Promise<void>;
}

/** Checkerboard backdrop behind the preview so transparent areas actually read as transparent. */
const CHECKERBOARD_STYLE = {
  backgroundImage:
    'conic-gradient(var(--color-line) 90deg, transparent 90deg 180deg, var(--color-line) 180deg 270deg, transparent 270deg)',
  backgroundSize: '16px 16px',
};

/**
 * Popup for importing a user-designed template: download the layout
 * guide, name it, upload the PNG they designed around it. Saving runs
 * the file through normalizeCustomTemplateImage + IndexedDB via the
 * addCustomTemplate callback the picker provides.
 */
export function ImportTemplateDialog({ onCancel, onImport }: ImportTemplateDialogProps) {
  const { t, lang } = useI18n();
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(selected: File | undefined) {
    setError(null);
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (selected.size > MAX_TEMPLATE_FILE_BYTES) {
      setError(t.customTemplate.errorTooLarge);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(selected);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
  }

  async function handleDownloadGuide() {
    try {
      await downloadTemplateGuide(lang);
    } catch {
      setError(t.customTemplate.errorGeneric);
    }
  }

  async function handleSave() {
    if (!file || !name.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await onImport(file, name.trim());
    } catch {
      setError(t.customTemplate.errorGeneric);
      setIsSaving(false);
    }
  }

  const canSave = !!file && name.trim().length > 0 && !isSaving;

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
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              className="text-sm text-text file:mr-3 file:rounded-[var(--radius-sm)] file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-sm file:text-text"
            />
          </label>

          {previewUrl && (
            <div
              className="mx-auto overflow-hidden rounded-[var(--radius-sm)] border border-line"
              style={CHECKERBOARD_STYLE}
            >
              <img src={previewUrl} alt="" className="block h-40 w-auto" />
            </div>
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
          <Button variant="primary" onClick={handleSave} disabled={!canSave}>
            {isSaving ? t.customTemplate.saving : t.customTemplate.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
