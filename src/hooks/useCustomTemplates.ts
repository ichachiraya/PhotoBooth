import { useEffect, useState } from 'react';
import type { Template } from '../types';
import {
  deleteCustomTemplate,
  listCustomTemplates,
  saveCustomTemplate,
} from '../lib/customTemplateStore';
import { buildCustomTemplate } from '../lib/customTemplateFactory';
import { normalizeCustomTemplateImage } from '../lib/customTemplateImage';

export interface CustomTemplateEntry {
  template: Template;
  storedId: string;
}

export interface UseCustomTemplatesResult {
  entries: CustomTemplateEntry[];
  isLoading: boolean;
  addCustomTemplate: (file: File, name: string) => Promise<void>;
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

  async function addCustomTemplate(file: File, name: string): Promise<void> {
    const imageBlob = await normalizeCustomTemplateImage(file);
    const stored = await saveCustomTemplate({ name, imageBlob });
    const template = await buildCustomTemplate(stored);
    setEntries((prev) => [...prev, { template, storedId: stored.id }]);
  }

  async function removeCustomTemplate(storedId: string): Promise<void> {
    await deleteCustomTemplate(storedId);
    setEntries((prev) => prev.filter((e) => e.storedId !== storedId));
  }

  return { entries, isLoading, addCustomTemplate, removeCustomTemplate };
}
