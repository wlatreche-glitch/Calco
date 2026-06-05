import { describe, expect, it } from 'vitest';
import { AntiRepetitionStore } from './antiRepetition';

describe('AntiRepetitionStore', () => {
  it('remembers recent signatures and avoids duplicates', () => {
    const store = new AntiRepetitionStore({ capacity: 3 });
    store.add('sig-a');
    store.add('sig-b');
    store.add('sig-c');
    expect(store.has('sig-a')).toBe(true);
    store.add('sig-d');
    expect(store.has('sig-a')).toBe(false);
    expect(store.getRecent()).toEqual(['sig-d', 'sig-c', 'sig-b']);
  });
});
