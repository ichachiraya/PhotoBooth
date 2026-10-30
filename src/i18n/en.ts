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
    newPhoto: string;
    newPhotoConfirm: string;
    newVersionAvailable: string;
    refresh: string;
    refreshConfirm: string;
    refreshAnyway: string;
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
    newPhoto: 'New photo',
    newPhotoConfirm: "This strip hasn't been saved yet. Start a new one anyway?",
    newVersionAvailable: 'New version available',
    refresh: 'Refresh',
    refreshConfirm: 'Your current photos will be lost. Refresh anyway?',
    refreshAnyway: 'Refresh anyway',
  },
};
