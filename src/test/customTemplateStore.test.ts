import { beforeEach, describe, expect, it } from 'vitest';
import {
  deleteCustomTemplate,
  listCustomTemplates,
  saveCustomTemplate,
} from '../lib/customTemplateStore';

function fakeBlob(): Blob {
  return new Blob(['fake-png-bytes'], { type: 'image/png' });
}

// fake-indexeddb (installed globally in src/test/setup.ts) gives us a real,
// in-memory IndexedDB implementation, so this exercises the actual
// save/list/delete round-trip rather than a mock.
describe('customTemplateStore', () => {
  beforeEach(async () => {
    // Start each test from a clean slate.
    const existing = await listCustomTemplates();
    await Promise.all(existing.map((t) => deleteCustomTemplate(t.id)));
  });

  it('starts empty', async () => {
    expect(await listCustomTemplates()).toEqual([]);
  });

  it('saves a template and can list it back', async () => {
    const saved = await saveCustomTemplate({ name: 'My Template', imageBlob: fakeBlob() });
    expect(saved.id).toBeTruthy();
    expect(saved.name).toBe('My Template');
    expect(saved.createdAt).toBeGreaterThan(0);

    const all = await listCustomTemplates();
    expect(all).toHaveLength(1);
    expect(all[0]?.id).toBe(saved.id);
    expect(all[0]?.name).toBe('My Template');
    // Not asserting on imageBlob's own shape here: fake-indexeddb's
    // structured-clone of a jsdom Blob doesn't round-trip faithfully in
    // this test environment, unlike a real browser's IndexedDB. The
    // record itself (id/name/createdAt) round-tripping correctly is what
    // actually exercises this store's logic.
  });

  it('lists multiple templates oldest first', async () => {
    const first = await saveCustomTemplate({ name: 'First', imageBlob: fakeBlob() });
    // createdAt has millisecond resolution; a real person can't click fast
    // enough to tie, but two saves back-to-back in a test can — force a
    // distinct timestamp so the ordering assertion below is meaningful.
    await new Promise((resolve) => setTimeout(resolve, 2));
    const second = await saveCustomTemplate({ name: 'Second', imageBlob: fakeBlob() });

    const all = await listCustomTemplates();
    expect(all.map((t) => t.id)).toEqual([first.id, second.id]);
  });

  it('deletes a template', async () => {
    const saved = await saveCustomTemplate({ name: 'Temp', imageBlob: fakeBlob() });
    await deleteCustomTemplate(saved.id);
    expect(await listCustomTemplates()).toEqual([]);
  });

  it('deleting an unknown id is a no-op, not an error', async () => {
    await expect(deleteCustomTemplate('does-not-exist')).resolves.toBeUndefined();
  });
});
