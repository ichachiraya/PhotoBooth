import type { FilterId } from '../../types';
import { FILTER_LABELS, FILTER_ORDER } from '../../lib/filters';
import { useI18n } from '../../i18n/useI18n';

interface FilterPickerProps {
  value: FilterId;
  onChange: (filter: FilterId) => void;
}

/** Filter choices, applied uniformly to all 3 photos. */
export function FilterPicker({ value, onChange }: FilterPickerProps) {
  const { lang } = useI18n();

  return (
    <div
      role="radiogroup"
      aria-label={lang === 'th' ? 'ฟิลเตอร์' : 'Filter'}
      className="flex flex-wrap gap-2"
    >
      {FILTER_ORDER.map((filter) => {
        const isSelected = filter === value;
        return (
          <button
            key={filter}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(filter)}
            className={`u-label rounded-[var(--radius-sm)] border px-3 py-1.5 transition-opacity duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
              isSelected
                ? 'border-sage text-text'
                : 'border-line text-text-secondary hover:text-text'
            }`}
          >
            {FILTER_LABELS[filter][lang]}
          </button>
        );
      })}
    </div>
  );
}
