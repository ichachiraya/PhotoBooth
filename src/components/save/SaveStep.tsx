import type { SlotPhotos, StripOptions, Template } from '../../types';
import { StripPreview } from './StripPreview';
import { SaveActions } from './SaveActions';

interface SaveStepProps {
  template: Template;
  photos: SlotPhotos;
  options: StripOptions;
  onOptionsChange: (next: StripOptions) => void;
  onSaved: () => void;
}

/** Final preview + save/share screen. */
export function SaveStep({ template, photos, options, onOptionsChange, onSaved }: SaveStepProps) {
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
    </div>
  );
}
