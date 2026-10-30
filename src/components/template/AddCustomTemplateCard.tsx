import { Plus } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';

interface AddCustomTemplateCardProps {
  onClick: () => void;
}

/**
 * Dashed-border card at the end of the template grid, opening the import
 * dialog. The inner placeholder matches TemplateThumbnail's own 96x288
 * box so this card lines up with the real template cards around it.
 */
export function AddCustomTemplateCard({ onClick }: AddCustomTemplateCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-line p-3 text-center text-text-secondary transition-opacity duration-150 ease-out hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
    >
      <span className="flex h-[288px] w-[96px] items-center justify-center">
        <Plus size={22} strokeWidth={1.5} />
      </span>
      <span className="text-sm">{t.customTemplate.addCard}</span>
    </button>
  );
}
