import type { SlotPhotos, StripOptions, Template } from '../../types';
import { TemplateThumbnail } from '../template/TemplateThumbnail';
import { FilterPicker } from './FilterPicker';
import { CaptionEditor } from './CaptionEditor';
import { Toggle } from '../ui/Toggle';
import { useI18n } from '../../i18n/useI18n';

interface EditStepProps {
  template: Template;
  photos: SlotPhotos;
  options: StripOptions;
  onOptionsChange: (next: StripOptions) => void;
}

/**
 * Edit screen: a live preview of the strip (template + photos + current
 * filter/caption, framed like a printed photo) plus the filter picker,
 * caption editor, and the export-mirror setting.
 */
export function EditStep({ template, photos, options, onOptionsChange }: EditStepProps) {
  const { lang } = useI18n();

  function patch(partial: Partial<StripOptions>) {
    onOptionsChange({ ...options, ...partial });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto overflow-hidden rounded-[var(--radius-md)] border border-line bg-bg p-1.5">
        <TemplateThumbnail
          template={template}
          photos={photos}
          width={200}
          options={{
            filter: options.filter,
            caption: options.caption,
            showDateStamp: options.showDateStamp,
            mirrorExport: options.mirrorExport,
          }}
        />
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="u-label text-text-secondary">{lang === 'th' ? 'ฟิลเตอร์' : 'Filter'}</h2>
        <FilterPicker value={options.filter} onChange={(filter) => patch({ filter })} />
      </section>

      <section>
        <CaptionEditor
          caption={options.caption}
          onCaptionChange={(caption) => patch({ caption })}
          showDateStamp={options.showDateStamp}
          onShowDateStampChange={(showDateStamp) => patch({ showDateStamp })}
        />
      </section>

      <section className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-sm text-text-secondary">
          {lang === 'th'
            ? 'ภาพที่บันทึกเป็นภาพสะท้อนเหมือนที่เห็นตอนถ่าย'
            : 'Saved photo is mirrored, matching what you saw while shooting'}
        </span>
        <Toggle
          checked={options.mirrorExport}
          onChange={(mirrorExport) => patch({ mirrorExport })}
          label={lang === 'th' ? 'สลับภาพสะท้อนตอนบันทึก' : 'Mirror the saved photo'}
        />
      </section>
    </div>
  );
}
