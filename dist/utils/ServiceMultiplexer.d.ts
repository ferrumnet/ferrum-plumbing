import { Injectable } from "ioc/Container";
import { LoggerFactory } from "logging/LoggerFactory";
/**
 * Multiplexes a service. Uses different providers in order.
 * Algo:
 *  1. Use the first provider.
 *  2. In case first provider does not respond, caller will call `next`.
 *  3. There would be an exponential fallback for each ID.
 *  4. Next get, fall back to the first item that is available
 */
export declare class ServiceMultiplexer<T> implements Injectable {
    private index;
    private providers;
    private log;
    constructor(providers: (() => T)[], logFac: LoggerFactory);
    __name__(): string;
    /**
     * Returns the current provider. If the current provider has not changed, will reset the retries
     */
    get(): T;
    failed(): void;
    retryAsync<TOut>(fun: (t: T) => Promise<TOut>): Promise<TOut | undefined>;
}
//# sourceMappingURL=ServiceMultiplexer.d.ts.map