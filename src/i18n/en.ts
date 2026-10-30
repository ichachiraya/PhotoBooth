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
  customTemplate: {
    addCard: string;
    dialogTitle: string;
    downloadGuide: string;
    instructions: string;
    nameLabel: string;
    namePlaceholder: string;
    fileLabel: string;
    save: string;
    saving: string;
    errorTooLarge: string;
    errorGeneric: string;
    deleteLabel: string;
    deleteConfirm: string;
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
  customTemplate: {
    addCard: 'Add your own',
    dialogTitle: 'Import a custom template',
    downloadGuide: 'Download the template guide',
    instructions:
      'Download the guide, design freely around the marked windows in any image editor, keep those windows transparent, then export a PNG at the same 600 × 1800 size and upload it below.',
    nameLabel: 'Name',
    namePlaceholder: 'My template',
    fileLabel: 'Your design (PNG)',
    save: 'Import',
    saving: 'Importing…',
    errorTooLarge: 'That file is too large (max 20MB).',
    errorGeneric: "Couldn't import that file. Please try a different PNG.",
    deleteLabel: 'Delete template',
    deleteConfirm: 'Delete this custom template?',
  },
};
