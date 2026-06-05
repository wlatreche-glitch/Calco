export interface AntiRepetitionOptions {
  capacity?: number;
}

export class AntiRepetitionStore {
  private capacity: number;
  private recentSignatures: string[] = [];

  constructor(options: AntiRepetitionOptions = {}) {
    this.capacity = options.capacity ?? 12;
  }

  add(signature: string) {
    if (!signature) return;
    if (this.recentSignatures.includes(signature)) return;
    this.recentSignatures.unshift(signature);
    if (this.recentSignatures.length > this.capacity) {
      this.recentSignatures.pop();
    }
  }

  has(signature: string) {
    return this.recentSignatures.includes(signature);
  }

  getRecent(): string[] {
    return [...this.recentSignatures];
  }

  clear() {
    this.recentSignatures = [];
  }
}
