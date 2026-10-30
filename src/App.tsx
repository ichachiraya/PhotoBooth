import { useState } from 'react';
import type { SlotPhotos, Step, StripOptions, Template } from './types';
import { PageShell } from './components/layout/PageShell';
import { LanguageToggle } from './components/ui/LanguageToggle';
import { Button } from './components/ui/Button';
import { CaptureStep } from './components/capture/CaptureStep';
import { TemplatePicker } from './components/template/TemplatePicker';
import { EditStep } from './components/edit/EditStep';
import { SaveStep } from './components/save/SaveStep';
import { templates } from './templates';
import { useBeforeUnload } from './hooks/useBeforeUnload';
import { useI18n } from './i18n/useI18n';

const STEP_ORDER: Step[] = ['template', 'capture', 'edit', 'save'];
const EMPTY_PHOTOS: SlotPhotos = [null, null, null];
const DEFAULT_STRIP_OPTIONS: StripOptions = {
  filter: 'none',
  caption: '',
  showDateStamp: false,
  mirrorExport: true, // default: export matches the (mirrored) live preview
  highQuality: false,
};

/** Top-level step router: template -> capture -> edit -> save. */
function App() {
  const [step, setStep] = useState<Step>('template');
  const [photos, setPhotos] = useState<SlotPhotos>(EMPTY_PHOTOS);
  const [template, setTemplate] = useState<Template>(templates[0]!);
  const [stripOptions, setStripOptions] = useState<StripOptions>(DEFAULT_STRIP_OPTIONS);
  const [isSaved, setIsSaved] = useState(false);
  const { t } = useI18n();

  // Any change after a save means the strip is unsaved again.
  function updatePhotos(next: SlotPhotos) {
    setPhotos(next);
    setIsSaved(false);
  }
  function updateTemplate(next: Template) {
    setTemplate(next);
    setIsSaved(false);
  }
  function updateOptions(next: StripOptions) {
    setStripOptions(next);
    setIsSaved(false);
  }

  const hasAnyPhoto = photos.some((p) => p !== null);
  useBeforeUnload(hasAnyPhoto && !isSaved);

  const index = STEP_ORDER.indexOf(step);
  const goNext = () => setStep(STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)]!);
  const goBack = () => setStep(STEP_ORDER[Math.max(index - 1, 0)]!);

  const canGoNext = step === 'capture' ? photos.every((p) => p !== null) : true;

  return (
    <PageShell step={step} headerActions={<LanguageToggle />}>
      <h1 className="text-center font-serif text-2xl">{t.appName}</h1>

      {step === 'template' && (
        <TemplatePicker photos={photos} selectedId={template.id} onSelect={updateTemplate} />
      )}

      {step === 'capture' && <CaptureStep photos={photos} onPhotosChange={updatePhotos} />}

      {step === 'edit' && (
        <EditStep
          template={template}
          photos={photos}
          options={stripOptions}
          onOptionsChange={updateOptions}
        />
      )}

      {step === 'save' && (
        <SaveStep
          template={template}
          photos={photos}
          options={stripOptions}
          onOptionsChange={updateOptions}
          onSaved={() => setIsSaved(true)}
        />
      )}

      <div className="flex justify-between gap-3">
        <Button variant="secondary" onClick={goBack} disabled={index === 0}>
          {t.common.back}
        </Button>
        <Button
          variant="primary"
          onClick={goNext}
          disabled={index === STEP_ORDER.length - 1 || !canGoNext}
        >
          {t.common.next}
        </Button>
      </div>
    </PageShell>
  );
}

export default App;
