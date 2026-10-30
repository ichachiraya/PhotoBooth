import { useState } from 'react';
import type { SlotPhotos, Step, StripOptions, Template } from './types';
import { PageShell } from './components/layout/PageShell';
import { LanguageToggle } from './components/ui/LanguageToggle';
import { Button } from './components/ui/Button';
import { CaptureStep } from './components/capture/CaptureStep';
import { TemplatePicker } from './components/template/TemplatePicker';
import { EditStep } from './components/edit/EditStep';
import { templates } from './templates';
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

/**
 * Top-level step router. 'template', 'edit' and 'save' are still
 * placeholders here; later milestones replace those bodies while keeping
 * this shell and the lifted `photos` state in place.
 */
function App() {
  const [step, setStep] = useState<Step>('template');
  const [photos, setPhotos] = useState<SlotPhotos>(EMPTY_PHOTOS);
  const [template, setTemplate] = useState<Template>(templates[0]!);
  const [stripOptions, setStripOptions] = useState<StripOptions>(DEFAULT_STRIP_OPTIONS);
  const { t } = useI18n();

  const index = STEP_ORDER.indexOf(step);
  const goNext = () => setStep(STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)]!);
  const goBack = () => setStep(STEP_ORDER[Math.max(index - 1, 0)]!);

  const canGoNext = step === 'capture' ? photos.every((p) => p !== null) : true;

  return (
    <PageShell step={step} headerActions={<LanguageToggle />}>
      <h1 className="text-center font-serif text-2xl">{t.appName}</h1>

      {step === 'template' && (
        <TemplatePicker photos={photos} selectedId={template.id} onSelect={setTemplate} />
      )}

      {step === 'capture' && <CaptureStep photos={photos} onPhotosChange={setPhotos} />}

      {step === 'edit' && (
        <EditStep
          template={template}
          photos={photos}
          options={stripOptions}
          onOptionsChange={setStripOptions}
        />
      )}

      {step === 'save' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[var(--radius-md)] border border-line bg-surface p-8 text-center">
          <p className="text-text-secondary">Step: {t.steps.save}</p>
        </div>
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
