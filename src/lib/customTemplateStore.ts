/**
 * Raw IndexedDB persistence for user-imported custom templates — a
 * browser-local database, same privacy model as the photos themselves:
 * nothing here is ever uploaded anywhere. Every call is wrapped so a
 * missing or broken IndexedDB (e.g. Safari private browsing) degrades to
 * "custom templates just won't persist" rather than throwing and
 * breaking the rest of the app.
 */

import type { TemplateOverlayMode } from './templateOverlayDetection';

export interface StoredCustomTemplate {
  id: string;
  name: string;
  createdAt: number;
  /** Whether the design draws on top of the photo or behind it — see templateOverlayDetection.ts. */
  mode: TemplateOverlayMode;
  /** Already normalized to a fixed 600x1800 PNG — see lib/customTemplateImage.ts. */
  imageBlob: Blob;
}

const DB_NAME = 'photobooth-custom-templates';
const DB_VERSION = 1;
const STORE_NAME = 'templates';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const request = run(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
    });
  } finally {
    db.close();
  }
}

export async function listCustomTemplates(): Promise<StoredCustomTemplate[]> {
  try {
    const all = await withStore<StoredCustomTemplate[]>('readonly', (store) => store.getAll());
    return all.sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

export async function saveCustomTemplate(input: {
  name: string;
  mode: TemplateOverlayMode;
  imageBlob: Blob;
}): Promise<StoredCustomTemplate> {
  const record: StoredCustomTemplate = {
    id: crypto.randomUUID(),
    name: input.name,
    createdAt: Date.now(),
    mode: input.mode,
    imageBlob: input.imageBlob,
  };
  await withStore('readwrite', (store) => store.add(record));
  return record;
}

export async function deleteCustomTemplate(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id));
}
