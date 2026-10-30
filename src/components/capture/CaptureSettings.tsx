import { FlipHorizontal2, SwitchCamera } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { useI18n } from '../../i18n/useI18n';

interface CaptureSettingsProps {
  countdownSeconds: 3 | 5 | 10;
  onCountdownChange: (seconds: 3 | 5 | 10) => void;
  mirrored: boolean;
  onToggleMirror: () => void;
  canSwitchCamera: boolean;
  onSwitchCamera: () => void;
  disabled?: boolean;
}

/** Countdown length, front/back camera switch, and live-preview mirror toggle. */
export function CaptureSettings({
  countdownSeconds,
  onCountdownChange,
  mirrored,
  onToggleMirror,
  canSwitchCamera,
  onSwitchCamera,
  disabled,
}: CaptureSettingsProps) {
  const { lang } = useI18n();

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <span className="u-label">{lang === 'th' ? 'เวลาถอยหลัง' : 'Countdown'}</span>
        <select
          value={countdownSeconds}
          disabled={disabled}
          onChange={(e) => onCountdownChange(Number(e.target.value) as 3 | 5 | 10)}
          className="rounded-[var(--radius-sm)] border border-line bg-bg px-2 py-1 text-text disabled:opacity-40"
        >
          <option value={3}>3s</option>
          <option value={5}>5s</option>
          <option value={10}>10s</option>
        </select>
      </label>

      <div className="flex gap-2">
        <IconButton
          icon={<FlipHorizontal2 size={18} strokeWidth={1.5} />}
          label={lang === 'th' ? 'สลับภาพสะท้อน' : 'Toggle mirror'}
          aria-pressed={mirrored}
          onClick={onToggleMirror}
          disabled={disabled}
          className={mirrored ? 'border-sage text-sage' : ''}
        />
        {canSwitchCamera && (
          <IconButton
            icon={<SwitchCamera size={18} strokeWidth={1.5} />}
            label={lang === 'th' ? 'สลับกล้อง' : 'Switch camera'}
            onClick={onSwitchCamera}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
