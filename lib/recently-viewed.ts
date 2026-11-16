/**
 * Local-only "recently viewed" history for the project gallery.
 *
 * There is no server-side view history, so this is a list of project ids in localStorage. Treat it
 * as a convenience cache: every read and write is best-effort, and a failure just means the gallery
 * shows nothing under "Recently viewed".
 */

export const RECENTLY_VIEWED_KEY = 'zyr0-recently-viewed';
export const RECENTLY_VIEWED_LIMIT = 12;

function storage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
}

function readIds(): string[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0);
  } catch {
    return [];
  }
}

/** Move `projectId` to the front of the history, keeping the list de-duplicated and bounded. */
export function recordProjectView(projectId: string): void {
  const store = storage();
  if (!store || !projectId) return;
  try {
    const next = [projectId, ...readIds().filter(id => id !== projectId)].slice(0, RECENTLY_VIEWED_LIMIT);
    store.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // Quota or private mode — the gallery degrades to its other tabs.
  }
}

/** Project ids, most recently viewed first. */
export function readRecentlyViewed(): string[] {
  return readIds();
}
