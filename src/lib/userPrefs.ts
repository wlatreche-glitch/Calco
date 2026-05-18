const FAV_KEY = 'calco_favorites_v1';
const RECENT_KEY = 'calco_recent_v1';
const FEEDBACK_KEY = 'calco_feedback_v1';

export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}
export function toggleFavorite(path: string): string[] {
  const cur = getFavorites();
  const next = cur.includes(path) ? cur.filter(p => p !== path) : [...cur, path];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}
export function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
export function pushRecent(path: string) {
  const cur = getRecent().filter(p => p !== path);
  cur.unshift(path);
  localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, 8)));
}

export type Feedback = { id: string; createdAt: number; tool?: string; text: string };
export function getFeedback(): Feedback[] {
  try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]'); } catch { return []; }
}
export function addFeedback(f: Omit<Feedback, 'id' | 'createdAt'>) {
  const all = getFeedback();
  all.unshift({ ...f, id: crypto.randomUUID(), createdAt: Date.now() });
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all.slice(0, 100)));
}