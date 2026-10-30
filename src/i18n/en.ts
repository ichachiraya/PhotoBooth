export interface Dictionary {
  appName: string;
  privacyNote: string;
  steps: {
    template: string;
    capture: string;
    edit: string;
    save: string;
  };
  common: {
    next: string;
    back: string;
    retake: string;
    cancel: string;
    confirm: string;
    loading: string;
  };
}

export const en: Dictionary = {
  appName: 'Photo Booth',
  privacyNote: 'Your photos stay on this device. Nothing is uploaded, ever.',
  steps: {
    template: 'Template',
    capture: 'Capture',
    edit: 'Edit',
    save: 'Save',
  },
  common: {
    next: 'Next',
    back: 'Back',
    retake: 'Retake',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading…',
  },
};
