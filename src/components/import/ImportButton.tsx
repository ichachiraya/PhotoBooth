import { useId, useRef } from 'react';
import { ImageUp } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';

interface ImportButtonProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

/** A small icon button that opens the native file picker (accept="image/*"). */
export function ImportButton({ onFileSelected, disabled, className = '' }: ImportButtonProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang } = useI18n();
  const label = lang === 'th' ? 'นำเข้ารูปภาพ' : 'Import a photo';

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-bg/85 text-text disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      >
        <ImageUp size={14} strokeWidth={1.5} />
      </button>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ''; // allow picking the same file again later
          if (file) onFileSelected(file);
        }}
      />
    </>
  );
}
