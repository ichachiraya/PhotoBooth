import type { SlotPhotos, StripOptions, Template } from '../../types';
import { StripPreview } from './StripPreview';
import { SaveActions } from './SaveActions';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n/useI18n';

interface SaveStepProps {
  template: Template;
  photos: SlotPhotos;
  options: StripOptions;
  onOptionsChange: (next: StripOptions) => void;
  onSaved: () => void;
  onNewPhoto: () => void;
}

/** Final preview + save/share screen. */
export function SaveStep({
  template,
  photos,
  options,
  onOptionsChange,
  onSaved,
  onNewPhoto,
}: SaveStepProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-6">
      <StripPreview template={template} photos={photos} options={options} />
      <SaveActions
        template={template}
        photos={photos}
        options={options}
        onOptionsChange={onOptionsChange}
        onSaved={onSaved}
      />
      <div className="border-t border-line pt-4">
        <Button variant="secondary" onClick={onNewPhoto} className="w-full">
          {t.common.newPhoto}
        </Button>
      </div>
    </div>
  );
}
