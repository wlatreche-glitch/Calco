function fallbackUUID(): string {
  return 'xxxxxx'.replace(/x/g, () => ((Math.random() * 36) | 0).toString(36));
}

export function createSessionSeed(): string {
  const now = Date.now().toString(36);
  const uuid = typeof crypto !== 'undefined' && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : fallbackUUID();
  return `${now}-${uuid}`;
}

function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed: string) {
  const hash = cyrb53(seed || createSessionSeed());
  const rnd = mulberry32(hash >>> 0);
  return {
    random: () => rnd(),
    randomFloat: (min = 0, max = 1) => min + rnd() * (max - min),
    randomInt: (min: number, max: number) => {
      const lo = Math.ceil(min);
      const hi = Math.floor(max);
      return Math.floor(rnd() * (hi - lo + 1)) + lo;
    },
    pick<T>(arr: T[]) {
      if (!arr || arr.length === 0) return undefined as any;
      return arr[Math.floor(rnd() * arr.length)];
    },
  };
}
