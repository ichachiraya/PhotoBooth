import { useId } from 'react';
import { useI18n } from '../../i18n/useI18n';

interface CaptionEditorProps {
  caption: string;
  onCaptionChange: (value: string) => void;
  showDateStamp: boolean;
  onShowDateStampChange: (value: boolean) => void;
}

const MAX_CAPTION_LENGTH = 48;

/** Optional caption text + optional auto date stamp, drawn into the template's caption area. */
export function CaptionEditor({
  caption,
  onCaptionChange,
  showDateStamp,
  onShowDateStampChange,
}: CaptionEditorProps) {
  const { lang } = useI18n();
  const inputId = useId();

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="flex flex-col gap-1.5">
        <span className="u-label text-text-secondary">
          {lang === 'th' ? 'คำบรรยาย (ไม่บังคับ)' : 'Caption (optional)'}
        </span>
        <input
          id={inputId}
          type="text"
          value={caption}
          maxLength={MAX_CAPTION_LENGTH}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder={lang === 'th' ? 'เช่น เพื่อนซี้ 2026' : 'e.g. Best friends 2026'}
          className="rounded-[var(--radius-sm)] border border-line bg-bg px-3 py-2 text-text placeholder:text-text-secondary"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={showDateStamp}
          onChange={(e) => onShowDateStampChange(e.target.checked)}
          className="h-4 w-4 accent-sage"
        />
        {lang === 'th' ? 'แสดงวันที่' : 'Show date stamp'}
      </label>
    </div>
  );
}
