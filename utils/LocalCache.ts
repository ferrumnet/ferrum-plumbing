import { Injectable } from '../ioc/Container';

interface CacheItem {
  time: number;
  item: any;
  timeout?: number;
}

const CLEANUP_TIME= 300000; // 5 minutes

export class LocalCache implements Injectable {
  private readonly cache = new Map<string, any>();
  private readonly promiseCache = new Map<string, Promise<any>>();
  private lastCleanup = Date.now();

  async getAsync<T>(key: string, factory?: () => Promise<T>, timeout?: number): Promise<T> {
    if (!this.get(key)) {
      if (this.promiseCache.has(key)) {
        return await this.promiseCache.get(key);
      }
      if (factory) {
        const res = factory!();
        try {
          this.promiseCache.set(key, res);
          this.set(key, await res, timeout);
        } finally {
          this.promiseCache.delete(key);
        }
      }
    }
    return  this.get<T>(key);
  }

  set<T>(key: string, item: T, timeout?: number) {
    this.cache.set(key, { time: Date.now(), item: item, timeout });
  }

  get<T>(key: string) {
    const res = this.cache.get(key);
    this.cleanup();
    if (res && res.timeout && (res.time + res.timeout) < Date.now()) {
      return undefined;
    }
    return res ? res.item : undefined;
  }

  remove(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    if ((now - this.lastCleanup) > CLEANUP_TIME) {
      const keys = Array.from(this.cache.keys());
      keys.forEach(k => {
        const val = this.cache.get(k) as CacheItem;
        if (val && val.timeout && ((now - val.time) > val.timeout)) {
          this.cache.delete(k);
        }
      });
    }
  }

  __name__(): string {
    return 'LocalCache';
  }
}
