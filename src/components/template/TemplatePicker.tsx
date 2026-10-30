import { useState } from 'react';
import { X } from 'lucide-react';
import type { SlotPhotos, Template } from '../../types';
import { templates } from '../../templates';
import { TemplateThumbnail } from './TemplateThumbnail';
import { AddCustomTemplateCard } from './AddCustomTemplateCard';
import { ImportTemplateDialog } from './ImportTemplateDialog';
import { useCustomTemplates } from '../../hooks/useCustomTemplates';
import { useI18n } from '../../i18n/useI18n';
import type { Lang } from '../../i18n/useI18n';

interface TemplateCardProps {
  template: Template;
  photos: SlotPhotos;
  isSelected: boolean;
  lang: Lang;
  onSelect: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}

function TemplateCard({
  template,
  photos,
  isSelected,
  lang,
  onSelect,
  onDelete,
  deleteLabel,
}: TemplateCardProps) {
  return (
    <div className="relative">
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        onClick={onSelect}
        className={`flex w-full flex-col items-center gap-2 rounded-[var(--radius-md)] border p-3 text-center transition-opacity duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
          isSelected ? 'border-sage bg-surface' : 'border-line hover:opacity-80'
        }`}
      >
        <TemplateThumbnail template={template} photos={photos} width={96} />
        <span className="text-sm text-text">{template.name[lang]}</span>
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={deleteLabel}
          title={deleteLabel}
          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-bg/85 text-text-secondary hover:text-text"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

interface TemplatePickerProps {
  photos: SlotPhotos;
  selectedId: string;
  onSelect: (template: Template) => void;
}

/**
 * A grid of template thumbnails, each rendered live with the current
 * photos: the built-in presets, then any templates the person has
 * imported themselves (persisted in this browser), then a card to
 * import another one.
 */
export function TemplatePicker({ photos, selectedId, onSelect }: TemplatePickerProps) {
  const { t, lang } = useI18n();
  const { entries, addCustomTemplate, removeCustomTemplate } = useCustomTemplates();
  const [isImporting, setIsImporting] = useState(false);

  async function handleImport(file: File, name: string) {
    await addCustomTemplate(file, name);
    setIsImporting(false);
  }

  async function handleDelete(storedId: string) {
    if (!window.confirm(t.customTemplate.deleteConfirm)) return;
    await removeCustomTemplate(storedId);
  }

  return (
    <>
      <div
        role="radiogroup"
        aria-label={lang === 'th' ? 'เลือกเทมเพลต' : 'Choose a template'}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            photos={photos}
            lang={lang}
            isSelected={template.id === selectedId}
            onSelect={() => onSelect(template)}
          />
        ))}

        {entries.map(({ template, storedId }) => (
          <TemplateCard
            key={template.id}
            template={template}
            photos={photos}
            lang={lang}
            isSelected={template.id === selectedId}
            onSelect={() => onSelect(template)}
            onDelete={() => void handleDelete(storedId)}
            deleteLabel={t.customTemplate.deleteLabel}
          />
        ))}

        <AddCustomTemplateCard onClick={() => setIsImporting(true)} />
      </div>

      {isImporting && (
        <ImportTemplateDialog onCancel={() => setIsImporting(false)} onImport={handleImport} />
      )}
    </>
  );
}
