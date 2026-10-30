import { useEffect, useState } from 'react';
import type { Template } from '../types';
import {
  deleteCustomTemplate,
  listCustomTemplates,
  saveCustomTemplate,
} from '../lib/customTemplateStore';
import { buildCustomTemplate } from '../lib/customTemplateFactory';
import type { TemplateOverlayMode } from '../lib/templateOverlayDetection';

export interface CustomTemplateEntry {
  template: Template;
  storedId: string;
}

export interface AddCustomTemplateInput {
  name: string;
  mode: TemplateOverlayMode;
  /** Already normalized + encoded — see lib/customTemplateImage.ts. */
  imageBlob: Blob;
}

export interface UseCustomTemplatesResult {
  entries: CustomTemplateEntry[];
  isLoading: boolean;
  addCustomTemplate: (input: AddCustomTemplateInput) => Promise<void>;
  removeCustomTemplate: (storedId: string) => Promise<void>;
}

/** Loads/persists user-imported templates from the browser-local IndexedDB store. */
export function useCustomTemplates(): UseCustomTemplatesResult {
  const [entries, setEntries] = useState<CustomTemplateEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await listCustomTemplates();
        const built = await Promise.all(
          stored.map(async (s) => ({ template: await buildCustomTemplate(s), storedId: s.id })),
        );
        if (!cancelled) setEntries(built);
      } catch (err) {
        console.error('Failed to load custom templates', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addCustomTemplate(input: AddCustomTemplateInput): Promise<void> {
    const stored = await saveCustomTemplate(input);
    const template = await buildCustomTemplate(stored);
    setEntries((prev) => [...prev, { template, storedId: stored.id }]);
  }

  async function removeCustomTemplate(storedId: string): Promise<void> {
    await deleteCustomTemplate(storedId);
    setEntries((prev) => prev.filter((e) => e.storedId !== storedId));
  }

  return { entries, isLoading, addCustomTemplate, removeCustomTemplate };
}
