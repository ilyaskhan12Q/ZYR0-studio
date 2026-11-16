import { beforeEach, describe, expect, it } from 'vitest';
import {
  readRecentlyViewed,
  recordProjectView,
  RECENTLY_VIEWED_KEY,
  RECENTLY_VIEWED_LIMIT,
} from '../recently-viewed';

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(key: string) { return this.map.has(key) ? this.map.get(key)! : null; }
  setItem(key: string, value: string) { this.map.set(key, value); }
  removeItem(key: string) { this.map.delete(key); }
  clear() { this.map.clear(); }
  key(index: number) { return Array.from(this.map.keys())[index] ?? null; }
  get length() { return this.map.size; }
}

describe('recently-viewed', () => {
  beforeEach(() => {
    (globalThis as { localStorage?: Storage }).localStorage = new MemoryStorage() as unknown as Storage;
  });

  it('returns an empty list when nothing has been viewed', () => {
    expect(readRecentlyViewed()).toEqual([]);
  });

  it('records a view at the front', () => {
    recordProjectView('a');
    recordProjectView('b');
    expect(readRecentlyViewed()).toEqual(['b', 'a']);
  });

  it('moves an existing project to the front without duplicating it', () => {
    recordProjectView('a');
    recordProjectView('b');
    recordProjectView('a');
    expect(readRecentlyViewed()).toEqual(['a', 'b']);
  });

  it('caps the history at the limit', () => {
    for (let i = 0; i < RECENTLY_VIEWED_LIMIT + 5; i++) {
      recordProjectView(`project-${i}`);
    }
    const ids = readRecentlyViewed();
    expect(ids).toHaveLength(RECENTLY_VIEWED_LIMIT);
    expect(ids[0]).toBe(`project-${RECENTLY_VIEWED_LIMIT + 4}`);
  });

  it('ignores malformed stored data instead of throwing', () => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, 'not json');
    expect(readRecentlyViewed()).toEqual([]);
    expect(() => recordProjectView('a')).not.toThrow();
    expect(readRecentlyViewed()).toEqual(['a']);
  });

  it('drops non-string entries from stored data', () => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(['a', 2, null, '', 'b']));
    expect(readRecentlyViewed()).toEqual(['a', 'b']);
  });
});
