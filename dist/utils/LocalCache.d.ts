import { Injectable } from '../ioc/Container';
export declare class LocalCache implements Injectable {
    private readonly cache;
    private readonly promiseCache;
    private lastCleanup;
    getAsync<T>(key: string, factory?: () => Promise<T>, timeout?: number): Promise<T>;
    set<T>(key: string, item: T, timeout?: number): void;
    get<T>(key: string): any;
    remove(key: string): void;
    clear(): void;
    cleanup(): void;
    __name__(): string;
}
//# sourceMappingURL=LocalCache.d.ts.map