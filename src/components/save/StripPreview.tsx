import type { SlotPhotos, StripOptions, Template } from '../../types';
import { TemplateThumbnail } from '../template/TemplateThumbnail';

interface StripPreviewProps {
  template: Template;
  photos: SlotPhotos;
  options: StripOptions;
}

/** The final strip preview, framed like a printed photo (thin border, soft edge). */
export function StripPreview({ template, photos, options }: StripPreviewProps) {
  return (
    <div className="mx-auto overflow-hidden rounded-[var(--radius-md)] border border-line bg-bg p-2 shadow-[0_1px_3px_rgba(59,54,49,0.08)]">
      <TemplateThumbnail
        template={template}
        photos={photos}
        width={240}
        options={{
          filter: options.filter,
          caption: options.caption,
          showDateStamp: options.showDateStamp,
          mirrorExport: options.mirrorExport,
        }}
      />
    </div>
  );
}
