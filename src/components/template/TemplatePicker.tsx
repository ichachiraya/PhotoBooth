import type { SlotPhotos, Template } from '../../types';
import { templates } from '../../templates';
import { TemplateThumbnail } from './TemplateThumbnail';
import { useI18n } from '../../i18n/useI18n';

interface TemplatePickerProps {
  photos: SlotPhotos;
  selectedId: string;
  onSelect: (template: Template) => void;
}

/** A grid of template thumbnails, each rendered live with the current photos. */
export function TemplatePicker({ photos, selectedId, onSelect }: TemplatePickerProps) {
  const { lang } = useI18n();

  return (
    <div
      role="radiogroup"
      aria-label={lang === 'th' ? 'เลือกเทมเพลต' : 'Choose a template'}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
    >
      {templates.map((template) => {
        const isSelected = template.id === selectedId;
        return (
          <button
            key={template.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(template)}
            className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-3 text-center transition-opacity duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
              isSelected ? 'border-sage bg-surface' : 'border-line hover:opacity-80'
            }`}
          >
            <TemplateThumbnail template={template} photos={photos} width={96} />
            <span className="text-sm text-text">{template.name[lang]}</span>
          </button>
        );
      })}
    </div>
  );
}
